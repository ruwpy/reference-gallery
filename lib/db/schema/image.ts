import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { relations } from "drizzle-orm";
import { project } from "./project";
import { folder } from "./folder";

export const image = pgTable("image", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  creatorId: text("user_id")
    .notNull()
    .references(() => user.id),
  projectId: text("project_id").notNull(),
  folderId: text("folder_id"),
  url: text("url").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const imageRelations = relations(image, ({ one }) => ({
  project: one(project, {
    fields: [image.projectId],
    references: [project.id],
  }),
  folder: one(folder, {
    fields: [image.folderId],
    references: [folder.id],
  }),
}));
