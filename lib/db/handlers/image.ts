"use server";

import { and, eq, isNull } from "drizzle-orm";
import { db } from "..";
import { image, image as schemaImage } from "../schema/image";
import { validateRequest } from "@/lib/auth";
import { generateId } from "lucia";

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
