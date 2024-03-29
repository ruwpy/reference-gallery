"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { project } from "../schema/project";
import { member } from "../schema/member";

export const getAllProjectMembers = async ({ projectId }: { projectId: string }) => {
  const projectFromDb = await db
    .select({ member })
    .from(project)
    .innerJoin(member, eq(project.id, member.projectId))
    .where(eq(member.projectId, projectId));

  return projectFromDb.map((p) => ({
    userId: p.member.userId,
    projectId: p.member.projectId,
  }));
};
