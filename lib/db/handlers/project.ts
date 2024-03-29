"use server";

import { generateId } from "lucia";
import { db } from "..";
import { project } from "../schema/project";
import { eq } from "drizzle-orm";
import { member } from "../schema/member";
import { user } from "../schema/user";
import { revalidatePath } from "next/cache";
import { deleteFolder, getAllFoldersFromProject } from "./folder";
import { useImperativeHandle } from "react";
import { deleteImage, getAllImagesFromProject } from "./image";

export const createProject = async ({ userId, name }: { userId: string; name: string }) => {
  const id = generateId(15);

  const newProject = await db
    .insert(project)
    .values({ id, ownerId: userId, name: name })
    .returning();

  await db.insert(member).values({ projectId: id, userId });

  revalidatePath("/");

  return newProject;
};

export const getProjects = async ({ userId }: { userId?: string }) => {
  if (!userId) return console.log("not auth");

  const res = await db
    .select({ project })
    .from(project)
    .innerJoin(member, eq(project.id, member.projectId))
    .innerJoin(user, eq(user.id, member.userId))
    .where(eq(user.id, userId));

  return res.map((r) => r.project);
};

export const getProject = async ({ projectId }: { projectId: string }) => {
  const [projectFromDb] = await db.select().from(project).where(eq(project.id, projectId));

  return projectFromDb;
};

export const deleteProject = async ({
  userId,
  projectId,
}: {
  userId: string;
  projectId: string;
}) => {
  const projectFromDb = await getProject({ projectId });
  if (projectFromDb.ownerId !== userId) return console.log("@[deleteProject] not auth");

  const folders = await getAllFoldersFromProject({ projectId: projectFromDb.id });
  const images = await getAllImagesFromProject({ projectId: projectFromDb.id });

  for (const folder of folders) {
    await deleteFolder({ folderId: folder.id, userId });
  }

  for (const image of images) {
    await deleteImage({ imageId: image.id, userId });
  }

  const [deletedProject] = await db.delete(project).where(eq(project.id, projectId)).returning();

  return deletedProject;
};
