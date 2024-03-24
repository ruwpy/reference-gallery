"use server";

import { env } from "@/env.mjs";
import { generateName } from "@/lib/utils";
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { generateId } from "lucia";

export const createImageUploadURL = async ({ filename }: { filename: string }) => {
  try {
    const fileExtension = filename.split(".")[filename.split(".").length - 1];
    const fileName = filename.replace(`.${fileExtension}`, "").replace(" ", "_");

    const client = new S3({
      region: "eu-north-1",
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
      endpoint: "https://s3.eu-north-1.amazonaws.com",
    });

    const command = new PutObjectCommand({
      Bucket: "reference-gallery-images",
      Key: `${fileName}-${generateId(10)}.${fileExtension}`,
      ContentType: `image/${fileExtension}`,
    });

    const url = await getSignedUrl(client, command, { expiresIn: 3600 });

    return { url, name: fileName, extension: fileExtension };
  } catch (error) {
    console.log(error);
  }
};