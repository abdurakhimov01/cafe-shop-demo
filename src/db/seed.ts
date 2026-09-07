/**
 * Fills an empty database with the room as it is described on the site: the
 * opening hours from the marketing copy, and a spread of tables that adds up
 * to the forty seats the Room section claims.
 *
 * Safe to re-run — it clears the three configuration tables first, and never
 * touches reservations.
 */
import { db } from "./index";
import { closures, openingHours, tables } from "./schema";

const ROOM = [
  { name: "1", seats: 2 },
  { name: "2", seats: 2 },
  { name: "3", seats: 2 },
  { name: "4", seats: 2 },
  { name: "5", seats: 4 },
  { name: "6", seats: 4 },
  { name: "7", seats: 4 },
  { name: "8", seats: 4 },
  { name: "9", seats: 4 },
  { name: "10", seats: 6 },
  { name: "Window", seats: 6 },
];

/** Sunday is 0, matching JavaScript's getDay(). */
const HOURS = [
  { dayOfWeek: 0, opensAt: "09:00", closesAt: "21:00", closed: false },
  { dayOfWeek: 1, opensAt: "07:30", closesAt: "22:00", closed: false },
  { dayOfWeek: 2, opensAt: "07:30", closesAt: "22:00", closed: false },
  { dayOfWeek: 3, opensAt: "07:30", closesAt: "22:00", closed: false },
  { dayOfWeek: 4, opensAt: "07:30", closesAt: "22:00", closed: false },
  { dayOfWeek: 5, opensAt: "07:30", closesAt: "23:00", closed: false },
  { dayOfWeek: 6, opensAt: "09:00", closesAt: "23:00", closed: false },
];

async function seed() {
  await db.delete(closures);
  await db.delete(openingHours);
  await db.delete(tables);

  await db.insert(tables).values(ROOM);
  await db.insert(openingHours).values(HOURS);

  const seats = ROOM.reduce((total, t) => total + t.seats, 0);
  console.log(`Seeded ${ROOM.length} tables (${seats} seats) and opening hours.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
