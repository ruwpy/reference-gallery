import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
import { env } from "./env.mjs";

dotenv.config();

export default {
  schema: ["./lib/db/schema/*.ts"],
  out: "./lib/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
} satisfies Config;
