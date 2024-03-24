import { DatabaseUser } from "@/lib/db/schema/user";

export declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<DatabaseUser, "id">;
  }

  interface User extends DatabaseUser {}
}
