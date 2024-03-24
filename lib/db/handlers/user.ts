"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { user as schemaUser } from "../schema/user";

export const getUserByEmail = async ({ email }: { email: string }) => {
  const [user] = await db.select().from(schemaUser).where(eq(schemaUser.email, email));
  return user;
};

export const getUserById = async ({ id }: { id: string }) => {
  const [user] = await db.select().from(schemaUser).where(eq(schemaUser.id, id));
  return user;
};

export const createUser = async (user: typeof schemaUser.$inferInsert) => {
  return await db
    .insert(schemaUser)
    .values({ ...user })
    .returning();
};
