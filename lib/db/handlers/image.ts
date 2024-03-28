"use server";

import { and, eq, isNull } from "drizzle-orm";
import { db } from "..";
import { image, image as schemaImage } from "../schema/image";
import { validateRequest } from "@/lib/auth";
import { generateId } from "lucia";
import { getProject } from "./project";
import { deleteS3Object } from "@/app/actions";

export const addImage = async ({
  projectId,
  folderId,
  name,
  imageUrl,
}: {
  projectId: string;
  folderId?: string;
  name: string;
  imageUrl: string;
}) => {
  const { user } = await validateRequest();

  if (!user) return console.log("not auth");

  const id = generateId(15);

  const values: typeof schemaImage.$inferInsert = {
    creatorId: user?.id,
    id,
    projectId,
    folderId,
    name,
    url: imageUrl,
  };

  const image = await db.insert(schemaImage).values(values).returning();

  return image;
};

export const getImage = async ({ imageId }: { imageId: string }) => {
  const [imageFromDb] = await db.select().from(image).where(eq(image.id, imageId));

  return imageFromDb;
};

export const getAllImagesFromFolder = async ({ folderId }: { folderId: string }) => {
  const images = await db.select().from(image).where(eq(image.folderId, folderId));

  return images;
};

export const getAllImagesFromProject = async ({ projectId }: { projectId: string }) => {
  const images = await db
    .select()
    .from(image)
    .where(and(eq(image.projectId, projectId), isNull(image.folderId)));

  return images;
};

export const deleteImage = async ({ imageId, userId }: { imageId: string; userId: string }) => {
  const imageFromDb = await getImage({ imageId });
  const project = await getProject({ projectId: imageFromDb.projectId });

  if (project.ownerId !== userId) return console.log("not auth");

  const [deletedImage] = await db.delete(image).where(eq(image.id, imageId)).returning();

  await deleteS3Object({ publicObjectUrl: deletedImage.url });

  return deletedImage;
};
