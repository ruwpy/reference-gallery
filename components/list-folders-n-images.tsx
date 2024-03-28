"use client";

import { deleteFolder } from "@/lib/db/handlers/folder";
import { deleteImage } from "@/lib/db/handlers/image";
import { folder } from "@/lib/db/schema/folder";
import { image } from "@/lib/db/schema/image";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const FoldersNImagesList = ({
  userId,
  images,
  folders,
}: {
  userId: string;
  images: (typeof image.$inferSelect)[];
  folders: (typeof folder.$inferSelect)[];
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const [currentId, setCurrentId] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<typeof image.$inferSelect | null>(null);

  const changeImage = (e: KeyboardEvent) => {
    if (currentId) {
      const indexOfCurrentImage = images.indexOf(images.filter((i) => i.id === currentId)[0]);

      if (e.key === "ArrowLeft") {
        let nextIndex = indexOfCurrentImage - 1;

        if (nextIndex < 0) {
          nextIndex = images.length - 1;
        }

        setCurrentId(images[nextIndex].id);
      }
      if (e.key === "ArrowRight") {
        let nextIndex = indexOfCurrentImage + 1;

        if (nextIndex >= images.length) {
          nextIndex = 0;
        }

        setCurrentId(images[nextIndex].id);
      }
    }
  };

  useEffect(() => {
    if (!currentId) setCurrentImage(null);

    setCurrentImage(images.filter((i) => i.id === currentId)[0]);
  }, [currentId]);

  useEffect(() => {
    if (!currentId) return document.removeEventListener("keydown", changeImage);

    document.addEventListener("keydown", changeImage);

    return () => document.removeEventListener("keydown", changeImage);
  }, [currentId]);

  const deleteObject = async (type: "folder" | "image", id: string) => {
    if (type === "folder") {
      await deleteFolder({ folderId: id, userId });
    }

    if (type === "image") {
      await deleteImage({ imageId: id, userId });
    }

    router.refresh();
  };

  return (
    <>
      <div className="grid grid-cols-4">
        {folders.map((f) => (
          <Link href={`${pathname}/${f.id}`} key={f.id}>
            <div
              id="folderObject"
              className="aspect-square p-[4px] flex flex-col justify-between border-r border-b border-[var(--font-color)]"
            >
              <span className="flex justify-between">
                <span className="w-fit z-10 bg-white">
                  <span className="opacity-50 p-[2px]">folder</span>
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    deleteObject("folder", f.id);
                  }}
                  id="folderObjectDeleteButton"
                  className="w-fit z-10 bg-white hidden"
                >
                  <span className="opacity-50 p-[2px]">delete</span>
                </button>
              </span>
              <span className="text-[18px] break-words">{f.name}</span>
            </div>
          </Link>
        ))}
        {images.map((i) => (
          <div
            key={i.id}
            id="folderObject"
            className="aspect-square relative flex flex-col justify-between border-r border-b border-[var(--font-color)]"
          >
            <span className="flex justify-between">
              <span className="w-fit z-10 bg-white">
                <span className="opacity-50 p-[2px]">image</span>
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  deleteObject("image", i.id);
                }}
                id="folderObjectDeleteButton"
                className="w-fit z-10 bg-white hidden"
              >
                <span className="opacity-50 p-[2px]">delete</span>
              </button>
            </span>
            <span className="w-fit max-w-[100%] break-words z-10 bg-white">
              <span className="text-[18px] bg-white p-[2px]">{i.name}</span>
            </span>
            <Image
              className="absolute cursor-pointer left-0 top-0 w-full h-full object-cover"
              src={i.url}
              width={512}
              height={512}
              alt="project image"
              onClick={() => setCurrentId(i.id)}
            />
          </div>
        ))}
      </div>
      {currentImage &&
        createPortal(
          <div
            onClick={() => setCurrentId(null)}
            className="absolute h-[100dvh] p-[50px] inset-0 bg-[#00000075] flex justify-center items-center z-50"
          >
            <div className="w-fit h-full" onClick={(e) => e.stopPropagation()}>
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none -z-10">
                <div className="w-[24px] h-[24px] rounded-full border-[2px] border-[transparent] border-t-white animate-spin"></div>
              </div>
              <Image
                className="h-full w-fit object-contain"
                src={currentImage.url}
                width={1920}
                height={1080}
                alt="project image"
              />
            </div>
          </div>,
          document.querySelector("#modal")!
        )}
    </>
  );
};
