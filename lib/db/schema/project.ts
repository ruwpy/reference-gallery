import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { image } from "./image";
import { folder } from "./folder";
import { relations } from "drizzle-orm";
import { usersToProjects } from "./user-to-project";

export const project = pgTable("project", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const projectRelations = relations(project, ({ one, many }) => ({
  folders: many(folder),
  images: many(image),
  owner: one(user, {
    fields: [project.ownerId],
    references: [user.id],
  }),
  usersToProjects: many(usersToProjects),
}));
