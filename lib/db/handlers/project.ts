"use server";

import { generateId } from "lucia";
import { db } from "..";
import { project } from "../schema/project";
import { eq } from "drizzle-orm";
import { usersToProjects } from "../schema/user-to-project";
import { user } from "../schema/user";
import { revalidatePath } from "next/cache";

export const createProject = async ({ userId, name }: { userId: string; name: string }) => {
  const id = generateId(15);

  const newProject = await db
    .insert(project)
    .values({ id, ownerId: userId, name: name })
    .returning();

  await db.insert(usersToProjects).values({ projectId: id, userId });

  revalidatePath("/");

  return newProject;
};

export const getProjects = async ({ userId }: { userId: string }) => {
  const projects = await db
    .select({ project })
    .from(project)
    .innerJoin(usersToProjects, eq(project.id, usersToProjects.projectId))
    .innerJoin(user, eq(user.id, usersToProjects.userId))
    .where(eq(user.id, userId));

  return projects;
};
