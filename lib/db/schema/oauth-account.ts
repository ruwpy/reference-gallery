import { pgTable, text } from "drizzle-orm/pg-core";
import { user } from "./user";

export const oauthAccount = pgTable("oauth_account", {
  userId: text("user_id")
    .notNull()
    .references(() => user.id)
    .primaryKey(),
  providerId: text("provider_id").notNull(),
  providerUserId: text("provider_user_id").notNull(),
  providerEmail: text("provider_email"),
});
