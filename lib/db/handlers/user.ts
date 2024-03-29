"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { user as userSchema } from "../schema/user";
import { storage } from "../schema/storage";

export const getUserByEmail = async ({ email }: { email: string }) => {
  const [user] = await db.select().from(userSchema).where(eq(userSchema.email, email));
  return user;
};

export const getUserById = async ({ id }: { id: string }) => {
  const [user] = await db.select().from(userSchema).where(eq(userSchema.id, id));
  return user;
};

export const createUser = async (user: typeof userSchema.$inferInsert) => {
  const newUser = await db
    .insert(userSchema)
    .values({ ...user })
    .returning();

  await db.insert(storage).values({ spaceLimit: 1073741824, userId: user.id, usedSpace: 0 });

  return newUser;
};
