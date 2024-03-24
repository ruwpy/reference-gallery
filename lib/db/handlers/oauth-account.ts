"use server";

import { and, eq } from "drizzle-orm";
import { db } from "..";
import { oauthAccount } from "../schema/oauth-account";

export const getUserOauthAccounts = async ({ userId }: { userId: string }) => {
  return await db.select().from(oauthAccount).where(eq(oauthAccount.userId, userId));
};

export const getOauthAccount = async ({
  userId,
  type,
}: {
  userId: string;
  type: OauthAccountType;
}) => {
  const [account] = await db
    .select()
    .from(oauthAccount)
    .where(and(eq(oauthAccount.userId, userId), eq(oauthAccount.providerId, type)));

  return account;
};

export const insertOauthAccount = async (account: typeof oauthAccount.$inferInsert) => {
  return await db
    .insert(oauthAccount)
    .values({
      ...account,
    })
    .returning();
};
