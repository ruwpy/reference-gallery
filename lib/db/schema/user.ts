import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { usersToProjects } from "./user-to-project";

export type DatabaseUser = typeof user.$inferInsert;

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull(),
  picture: text("picture").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  usersToProjects: many(usersToProjects),
}));
