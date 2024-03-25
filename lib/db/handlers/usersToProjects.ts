"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { project } from "../schema/project";
import { usersToProjects } from "../schema/user-to-project";

export const getAllProjectMembers = async ({ projectId }: { projectId: string }) => {
  const projectFromDb = await db
    .select({ usersToProjects })
    .from(project)
    .innerJoin(usersToProjects, eq(project.id, usersToProjects.projectId))
    .where(eq(usersToProjects.projectId, projectId));

  return projectFromDb.map((p) => ({
    userId: p.usersToProjects.userId,
    projectId: p.usersToProjects.projectId,
  }));
};
