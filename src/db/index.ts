import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env.local and paste your Postgres connection string.",
  );
}

/**
 * One connection pool per process. Next.js hot-reloads modules in development,
 * which would otherwise open a fresh pool on every edit until Postgres refuses
 * new connections; stashing it on `globalThis` keeps a single pool alive.
 */
const globalForDb = globalThis as unknown as {
  connection?: ReturnType<typeof postgres>;
};

const connection =
  globalForDb.connection ??
  postgres(url, {
    // Serverless functions are short-lived and may be frozen mid-request, so
    // keep the pool small and let idle connections go.
    max: 5,
    idle_timeout: 20,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.connection = connection;
}

export const db = drizzle(connection, { schema });
export { schema };
