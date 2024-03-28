"use server";

import { env } from "@/env.mjs";
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { generateId } from "lucia";

export const createImageUploadURL = async ({ filename }: { filename: string }) => {
  try {
    const fileExtension = filename.split(".")[filename.split(".").length - 1];
    const fileName = filename.replace(`.${fileExtension}`, "").replace(" ", "_");
    let contentType: string = "";

    const allContentTypes = {
      "image/jpeg": ["jpg", "jpeg", "jfif", "pjpeg", "pjp"],
      "image/apng": ["apng"],
      "image/avif": ["avif"],
      "image/gif": ["gif"],
      "image/png": ["png"],
      "image/svg+xml": ["svg"],
      "image/webp": ["webp"],
      "image/bmp": ["bmp"],
      "image/x-icon": ["ico", "cur"],
      "image/tiff": ["tif", "tiff"],
    };

    for (const [type, extensions] of Object.entries(allContentTypes)) {
      if (extensions.indexOf(fileExtension) >= 0) {
        contentType = type;
        break;
      }
    }

    if (!contentType) return console.log("incorrect file");

    console.log(contentType);

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
      ContentType: contentType,
    });

    const url = await getSignedUrl(client, command, { expiresIn: 3600 });

    return { url, name: fileName, extension: fileExtension, contentType };
  } catch (error) {
    console.log(error);
  }
};
