"use server";

import { and, eq, isNull } from "drizzle-orm";
import { db } from "..";
import { folder } from "../schema/folder";
import { generateId } from "lucia";

export const createFolder = async ({
  projectId,
  name,
  parentFolderId,
}: {
  projectId: string;
  name: string;
  parentFolderId?: string;
}) => {
  const id = generateId(15);

  const newProject = await db
    .insert(folder)
    .values({ id, name, projectId, parentFolderId })
    .returning();

  return newProject;
};

export const getAllFoldersFromProject = async ({ projectId }: { projectId: string }) => {
  const folders = await db
    .select()
    .from(folder)
    .where(and(eq(folder.projectId, projectId), isNull(folder.parentFolderId)));

  return folders;
};

export const getAllFoldersFromFolder = async ({ parentFolderId }: { parentFolderId: string }) => {
  const folders = await db.select().from(folder).where(eq(folder.parentFolderId, parentFolderId));

  return folders;
};
