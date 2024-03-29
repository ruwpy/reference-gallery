import { eq } from "drizzle-orm";
import { db } from "..";
import { storage } from "../schema/storage";

export const getStorage = async ({ userId }: { userId?: string }) => {
  if (!userId) return undefined;

  const [storageData] = await db.select().from(storage).where(eq(storage.userId, userId));

  return storageData;
};

export const increaseUsedSpace = async ({ userId, bytes }: { userId: string; bytes: number }) => {
  if (!userId) return undefined;

  const storageFromDb = await getStorage({ userId });

  const updatedStorage = await db
    .update(storage)
    .set({ usedSpace: storageFromDb!.usedSpace + bytes })
    .where(eq(storage.userId, userId))
    .returning();

  return updatedStorage;
};

export const increaseSpaceLimit = async ({
  userId,
  newLimitInBytes,
}: {
  userId: string;
  newLimitInBytes: number;
}) => {
  if (!userId) return undefined;

  const updatedStorage = await db
    .update(storage)
    .set({ spaceLimit: newLimitInBytes })
    .where(eq(storage.userId, userId))
    .returning();

  return updatedStorage;
};
