import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { user } from "./user";
import { project } from "./project";
import { relations } from "drizzle-orm";

export const usersToProjects = pgTable(
  "users_to_projects",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.projectId, t.userId] }),
  })
);

export const usersToProjectsRelations = relations(usersToProjects, ({ one }) => ({
  project: one(project, {
    fields: [usersToProjects.projectId],
    references: [project.id],
  }),
  user: one(user, {
    fields: [usersToProjects.userId],
    references: [user.id],
  }),
}));
