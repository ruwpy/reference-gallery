"use server";

import { and, eq, isNull } from "drizzle-orm";
import { db } from "..";
import { folder } from "../schema/folder";
import { generateId } from "lucia";
import { getProject } from "./project";
import { deleteImage, getAllImagesFromFolder } from "./image";

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

export const getFolder = async ({ folderId }: { folderId: string }) => {
  const [folderFromDb] = await db.select().from(folder).where(eq(folder.id, folderId));

  return folderFromDb;
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

export const deleteFolder = async ({ folderId, userId }: { folderId: string; userId: string }) => {
  const folderFromDb = await getFolder({ folderId });
  const project = await getProject({ projectId: folderFromDb.projectId });

  if (project.ownerId !== userId) return console.log("not auth");

  const deletedFolders = [];
  const deletedImages = [];

  const foldersToDelete: string[] = [folderId];

  foldersToDelete.push(...(await getInnerFolders({ folderId: folderFromDb.id })));

  for await (const id of foldersToDelete) {
    const innerFolder = await getFolder({ folderId: id });

    const images = await getAllImagesFromFolder({ folderId: innerFolder.id });

    if (images.length > 0) {
      for await (const image of images) {
        const deletedImage = await deleteImage({ imageId: image.id, userId });

        deletedImages.push(deletedImage);
      }
    }

    const [deletedFolder] = await db.delete(folder).where(eq(folder.id, id)).returning();
    deletedFolders.push(deletedFolder);
  }

  return [deletedFolders, deletedImages];
};

export const getInnerFolders = async ({ folderId }: { folderId: string }) => {
  const folderIds: string[] = [];

  const getChildFolders = async (folderId: string) => {
    const childFolders = await db.select().from(folder).where(eq(folder.parentFolderId, folderId));

    for (const childFolder of childFolders) {
      folderIds.push(childFolder.id);
      await getChildFolders(childFolder.id);
    }
  };

  await getChildFolders(folderId);

  return folderIds;
};
