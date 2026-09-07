import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * A booking moves in one direction only: pending → confirmed → seated, or out
 * to cancelled / no_show. Nothing returns to pending.
 */
export const reservationStatus = pgEnum("reservation_status", [
  "pending",
  "confirmed",
  "seated",
  "cancelled",
  "no_show",
]);

/**
 * The physical tables in the room. `seats` is the capacity the availability
 * check works against; retiring a table sets `active` to false rather than
 * deleting it, so past reservations keep pointing at something real.
 */
export const tables = pgTable("tables", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 40 }).notNull().unique(),
  seats: integer().notNull(),
  active: boolean().notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * When the room is open, one row per weekday (0 = Sunday). A day with no row,
 * or one marked closed, takes no bookings at all.
 */
export const openingHours = pgTable("opening_hours", {
  dayOfWeek: integer("day_of_week").primaryKey(),
  opensAt: time("opens_at").notNull(),
  closesAt: time("closes_at").notNull(),
  closed: boolean().notNull().default(false),
});

/**
 * One-off exceptions to the opening hours: a holiday, a private hire, an
 * afternoon the kitchen is shut. A row with no times closes the whole day.
 */
export const closures = pgTable(
  "closures",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    date: date().notNull(),
    startsAt: time("starts_at"),
    endsAt: time("ends_at"),
    reason: varchar({ length: 140 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("closures_date_idx").on(t.date)],
);

/**
 * A booked table. `reference` is the short code the guest quotes on the phone;
 * it is generated once and never changes.
 *
 * The date and time are stored apart from any timezone: the café's clock is
 * the only clock that matters, and a guest booking "19:00" means 19:00 in the
 * room regardless of where they were sitting when they booked it.
 */
export const reservations = pgTable(
  "reservations",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    reference: varchar({ length: 8 }).notNull(),
    date: date().notNull(),
    startsAt: time("starts_at").notNull(),
    partySize: integer("party_size").notNull(),
    tableId: integer("table_id").references(() => tables.id),
    status: reservationStatus().notNull().default("confirmed"),

    guestName: varchar("guest_name", { length: 120 }).notNull(),
    guestEmail: varchar("guest_email", { length: 200 }).notNull(),
    guestPhone: varchar("guest_phone", { length: 40 }).notNull(),
    notes: text(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("reservations_reference_idx").on(t.reference),
    // Every availability check and every admin day view filters on the date
    // first, so that column leads the index.
    index("reservations_date_time_idx").on(t.date, t.startsAt),
  ],
);

export type Table = typeof tables.$inferSelect;
export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;
export type OpeningHour = typeof openingHours.$inferSelect;
export type Closure = typeof closures.$inferSelect;
