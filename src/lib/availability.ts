import { and, eq, inArray } from "drizzle-orm";
import { format } from "date-fns";
import { db } from "@/db";
import { closures, openingHours, reservations, tables } from "@/db/schema";

/** The pool, or a transaction taken from it — both answer the same queries. */
type DbClient = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

/** How long a table is held for one booking. */
export const SEATING_MINUTES = 90;

/** Bookings start on the half hour. */
export const SLOT_STEP_MINUTES = 30;

/** The last seating starts this long before closing. */
export const LAST_SEATING_BEFORE_CLOSE = SEATING_MINUTES;

/** Shortest notice the kitchen will take a booking on. */
export const LEAD_TIME_MINUTES = 60;

/** Statuses that still hold a table. Cancelled and no-show release it. */
const HOLDING = ["pending", "confirmed", "seated"] as const;

export interface Slot {
  /** "HH:MM", the time a guest sees and books. */
  time: string;
  available: boolean;
  /** Tables that could take this party at this time, smallest first. */
  tableIds: number[];
}

/** "19:30" or "19:30:00" → 1170. */
export function toMinutes(clock: string): number {
  const [h, m] = clock.split(":");
  return Number(h) * 60 + Number(m);
}

/** 1170 → "19:30". */
export function toClock(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Two half-open ranges overlap when each starts before the other ends. */
function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Every seating time on `isoDate` that could take a party of `partySize`,
 * with the tables that could hold it.
 *
 * A slot is offered when the room is open, no closure covers it, and at least
 * one active table large enough is free for the whole seating.
 */
export async function getAvailability(
  isoDate: string,
  partySize: number,
  /**
   * Pass the transaction when the caller holds a lock, so the read happens on
   * the same connection as the write it is about to authorise.
   */
  client: DbClient = db,
): Promise<Slot[]> {
  // Date-only string, parsed as local midnight so the weekday is the café's.
  const weekday = new Date(`${isoDate}T00:00:00`).getDay();

  const [hours, dayClosures, roomTables, booked] = await Promise.all([
    client.query.openingHours.findFirst({
      where: eq(openingHours.dayOfWeek, weekday),
    }),
    client.select().from(closures).where(eq(closures.date, isoDate)),
    client.select().from(tables).where(eq(tables.active, true)),
    client
      .select({
        tableId: reservations.tableId,
        startsAt: reservations.startsAt,
      })
      .from(reservations)
      .where(
        and(
          eq(reservations.date, isoDate),
          inArray(reservations.status, [...HOLDING]),
        ),
      ),
  ]);

  if (!hours || hours.closed) return [];

  const opens = toMinutes(hours.opensAt);
  const closes = toMinutes(hours.closesAt);

  // A table that seats fewer than the party can never work; offering the
  // largest first would strand small parties on big tables, so sort ascending
  // and let the booking take the tightest fit.
  const usable = roomTables
    .filter((t) => t.seats >= partySize)
    .sort((a, b) => a.seats - b.seats);

  if (usable.length === 0) return [];

  // On today, everything already past — plus the next hour — is gone.
  const now = new Date();
  const isToday = isoDate === format(now, "yyyy-MM-dd");
  const earliest = isToday
    ? now.getHours() * 60 + now.getMinutes() + LEAD_TIME_MINUTES
    : 0;

  const slots: Slot[] = [];

  for (
    let start = opens;
    start <= closes - LAST_SEATING_BEFORE_CLOSE;
    start += SLOT_STEP_MINUTES
  ) {
    if (start < earliest) continue;

    const end = start + SEATING_MINUTES;

    const closed = dayClosures.some((c) => {
      // A closure with no times shuts the whole day.
      if (!c.startsAt || !c.endsAt) return true;
      return overlaps(start, end, toMinutes(c.startsAt), toMinutes(c.endsAt));
    });

    if (closed) {
      slots.push({ time: toClock(start), available: false, tableIds: [] });
      continue;
    }

    const takenTableIds = new Set(
      booked
        .filter((r) => {
          const rStart = toMinutes(r.startsAt);
          return overlaps(start, end, rStart, rStart + SEATING_MINUTES);
        })
        .map((r) => r.tableId),
    );

    const free = usable
      .filter((t) => !takenTableIds.has(t.id))
      .map((t) => t.id);

    slots.push({
      time: toClock(start),
      available: free.length > 0,
      tableIds: free,
    });
  }

  return slots;
}

/**
 * Re-checks one slot at booking time and returns the table to seat the party
 * at, or null when the slot went while the guest was filling in the form.
 *
 * The availability list a guest is looking at is always a little stale, so the
 * write path never trusts it.
 */
export async function claimTable(
  isoDate: string,
  time: string,
  partySize: number,
  client: DbClient = db,
): Promise<number | null> {
  const slots = await getAvailability(isoDate, partySize, client);
  const slot = slots.find((s) => s.time === time);
  if (!slot?.available) return null;
  // Smallest table that fits — getAvailability already sorted them.
  return slot.tableIds[0] ?? null;
}
