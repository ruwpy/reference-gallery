import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { image } from "./image";
import { project } from "./project";
import { relations } from "drizzle-orm";

export const folder = pgTable("folder", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  parentFolderId: text("parent_folder_id"),
  projectId: text("project_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const folderRelations = relations(folder, ({ one, many }) => ({
  project: one(project, {
    fields: [folder.projectId],
    references: [project.id],
  }),
  parentFolder: one(folder, {
    fields: [folder.parentFolderId],
    references: [folder.id],
  }),
  images: many(image),
}));
