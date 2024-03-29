"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { project } from "../schema/project";
import { member } from "../schema/member";
import { user } from "../schema/user";
import { getProject } from "./project";

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

export const addMemberToProject = async ({
  memberEmail,
  userId,
  projectId,
}: {
  memberEmail: string;
  userId: string;
  projectId: string;
}) => {
  const projectFromDb = await getProject({ projectId });
  if (projectFromDb.ownerId !== userId) return undefined;

  const members = await getAllProjectMembers({ projectId });

  const [userFromDb] = await db.select().from(user).where(eq(user.email, memberEmail));

  const isAlreadyMember = members.filter((m) => m.userId === userFromDb.email);
  if (isAlreadyMember) return undefined;

  const newMember = await db
    .insert(member)
    .values({ projectId, userId: userFromDb.id })
    .returning();

  return newMember;
};
