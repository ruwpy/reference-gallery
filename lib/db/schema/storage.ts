import { pgTable, primaryKey, text, bigint } from "drizzle-orm/pg-core";
import { user } from "./user";
import { project } from "./project";
import { relations } from "drizzle-orm";

export const storage = pgTable(
  "storage",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    usedSpace: bigint("used_space", { mode: "number" }).notNull(),
    spaceLimit: bigint("space_limit", { mode: "number" }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId] }),
  })
);

export const storageRelations = relations(storage, ({ one }) => ({
  user: one(user, {
    fields: [storage.userId],
    references: [user.id],
  }),
}));
