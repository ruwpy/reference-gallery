"use client";

import { deleteProject } from "@/lib/db/handlers/project";
import { project } from "@/lib/db/schema/project";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const ProjectList = async ({
  projects,
  userId,
}: {
  projects: (typeof project.$inferSelect)[];
  userId: string;
}) => {
  const router = useRouter();

  const deleteObjectHandler = async (id: string) => {
    await deleteProject({ projectId: id, userId });

    router.refresh();
  };

  return (
    <div className="grid grid-cols-4">
      {projects.map((p) => (
        <Link href={`/${p.id}`} key={p.id}>
          <div
            id="folderObject"
            className="aspect-square p-[4px] flex flex-col justify-between border-r border-b border-[var(--font-color)]"
          >
            <span className="flex justify-between">
              <span className="w-fit z-10 bg-white">
                <span className="opacity-50 p-[2px]">project</span>
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  deleteObjectHandler(p.id);
                }}
                id="folderObjectDeleteButton"
                className="w-fit z-10 bg-white hidden"
              >
                <span className="opacity-50 p-[2px]">delete</span>
              </button>
            </span>
            <span className="text-[18px] break-words">{p.name}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};
