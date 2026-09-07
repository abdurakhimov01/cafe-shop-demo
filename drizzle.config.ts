import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Next.js loads .env.local itself; drizzle-kit runs outside Next, so it needs
// the file read explicitly.
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
