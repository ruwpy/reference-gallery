import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { user } from "./user";
import { project } from "./project";
import { relations } from "drizzle-orm";

export const member = pgTable(
  "member",
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

export const memberRelations = relations(member, ({ one }) => ({
  project: one(project, {
    fields: [member.projectId],
    references: [project.id],
  }),
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
}));
