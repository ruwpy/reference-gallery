import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { env } from "@/env.mjs";
import { drizzle } from "drizzle-orm/postgres-js";

const client = postgres(env.DATABASE_URL);
const db = drizzle(client);

const main = async () => {
  await migrate(db, { migrationsFolder: "./lib/db/migrations" });

  process.exit(0);
};

main().catch((e) => {
  console.log(`Error happened while migrating: ${e}`);
});
