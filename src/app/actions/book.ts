"use server";

import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { reservations } from "@/db/schema";
import { getAvailability } from "@/lib/availability";

const bookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Pick a time"),
  partySize: z.coerce.number().int().min(1).max(12),
  guestName: z.string().trim().min(2, "Tell us who to expect").max(120),
  guestEmail: z.email("That email does not look right").max(200),
  guestPhone: z.string().trim().min(6, "We need a number to call").max(40),
  notes: z.string().trim().max(500).optional(),
});

export type BookingResult =
  | { ok: true; reference: string; date: string; time: string }
  | { ok: false; error: string; fields?: Record<string, string> };

/** Unambiguous alphabet — no O/0, no I/1, so it survives being read aloud. */
const CODE_ALPHABET = "ACDEFGHJKLMNPQRTUVWXY3456789";

function newReference() {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

export async function createBooking(
  formData: FormData,
): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fields[key] ??= issue.message;
    }
    return { ok: false, error: "Please check the highlighted fields.", fields };
  }

  const booking = parsed.data;

  // Refuse dates in the past outright — the availability check would happily
  // return slots for last Tuesday.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(`${booking.date}T00:00:00`) < today) {
    return { ok: false, error: "That date has already passed." };
  }

  try {
    return await db.transaction(async (tx) => {
      // Serialise every booking for this date. Two guests racing for the last
      // table now queue instead of both being told yes; the lock is released
      // when the transaction ends, so it never outlives the request.
      await tx.execute(
        sql`select pg_advisory_xact_lock(hashtext(${booking.date}))`,
      );

      const slots = await getAvailability(booking.date, booking.partySize, tx);
      const slot = slots.find((s) => s.time === booking.time);

      if (!slot?.available) {
        return {
          ok: false as const,
          error:
            "That time was taken while you were filling this in. Please pick another.",
        };
      }

      const [row] = await tx
        .insert(reservations)
        .values({
          reference: newReference(),
          date: booking.date,
          startsAt: booking.time,
          partySize: booking.partySize,
          tableId: slot.tableIds[0],
          guestName: booking.guestName,
          guestEmail: booking.guestEmail,
          guestPhone: booking.guestPhone,
          notes: booking.notes || null,
        })
        .returning({ reference: reservations.reference });

      return {
        ok: true as const,
        reference: row.reference,
        date: booking.date,
        time: booking.time,
      };
    });
  } catch (error) {
    console.error("Booking failed", error);
    return {
      ok: false,
      error: "Something went wrong on our side. Please call us instead.",
    };
  }
}

/** Slots for the date picker. Read-only, so no lock and no transaction. */
export async function loadSlots(isoDate: string, partySize: number) {
  const slots = await getAvailability(isoDate, partySize);
  return slots.filter((s) => s.available).map((s) => s.time);
}
