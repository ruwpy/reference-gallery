"use client";

import { createFolder } from "@/lib/db/handlers/folder";
import { createProject } from "@/lib/db/handlers/project";
import { generateName } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CreateFolderButtonProps {
  children?: React.ReactNode;
  userId?: string;
  projectId?: string;
  folderId?: string;
}

export const CreateFolderButton = ({
  userId,
  projectId,
  folderId,
  children,
}: CreateFolderButtonProps) => {
  const [isCreating, setCreating] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();

  const discardCreating = () => {
    setCreating(false);
    setInputValue("");
  };

  const onConfirm = async () => {
    try {
      setLoading(true);
      const name = inputValue || generateName();

      if (projectId) {
        await createFolder({
          projectId,
          name,
          parentFolderId: folderId,
        });
      }

      if (userId) {
        await createProject({ userId, name });
      }

      discardCreating();

      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col flex-grow border-b border-[var(--font-color)]">
        {isCreating ? (
          <input
            className="h-[40px] w-full text-center focus:outline-none"
            type="text"
            placeholder={`enter name of the ${projectId ? "folder" : "project"} or leave it blank`}
            maxLength={48}
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />
        ) : (
          <button className="h-[40px]" onClick={() => setCreating(true)}>
            {children}
          </button>
        )}
      </div>
      {isCreating && (
        <div className="flex border-b border-[var(--font-color)]">
          <button
            disabled={isLoading}
            onClick={() => discardCreating()}
            className="h-[40px] flex-grow disabled:pointer-events-none disabled:opacity-50"
          >
            discard
          </button>
          <button
            disabled={isLoading}
            onClick={() => onConfirm()}
            className="h-[40px] flex-grow bg-[var(--font-color)] text-white disabled:pointer-events-none disabled:opacity-50"
          >
            confirm
          </button>
        </div>
      )}
    </>
  );
};
