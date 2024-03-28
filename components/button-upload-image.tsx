"use client";

import { createImageUploadURL } from "@/app/actions";
import { addImage } from "@/lib/db/handlers/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export const UploadImageButton = ({
  folderId,
  projectId,
}: {
  folderId?: string;
  projectId: string;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  const uploadImages = async (fileList: FileList | null) => {
    if (!fileList) return;
    setLoading(true);

    for await (const file of fileList) {
      const imageData = await createImageUploadURL({ filename: file.name });

      if (imageData) {
        try {
          await fetch(imageData.url, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": imageData.contentType,
            },
          });

          const publicUrl = imageData.url.split("?")[0];

          await addImage({
            imageUrl: publicUrl,
            name: imageData.name,
            projectId: projectId,
            folderId: folderId,
          });

          router.refresh();
        } catch (error) {
          console.log(error);
        }
      }
    }

    setLoading(false);

    if (inputRef.current) inputRef.current.files = null;
  };

  return (
    <div className="relative h-[40px] flex-grow border-b border-[var(--font-color)]">
      {isLoading ? (
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-[24px] h-[24px] rounded-full border-[2px] border-[transparent] border-t-[#000] animate-spin"></div>
        </div>
      ) : (
        <label
          htmlFor="imageInput"
          className="cursor-pointer w-full h-full flex justify-center items-center"
        >
          add image
        </label>
      )}
      <input
        ref={inputRef}
        id="imageInput"
        name="imageInput"
        className="hidden"
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => uploadImages(e.target.files)}
      />
    </div>
  );
};
