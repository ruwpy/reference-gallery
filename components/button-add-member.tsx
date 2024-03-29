"use client";

import { addMemberToProject } from "@/lib/db/handlers/member";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CreateFolderButtonProps {
  userId: string;
  projectId?: string;
}

export const AddMemberButton = ({ userId, projectId }: CreateFolderButtonProps) => {
  const [isAdding, setAdding] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();

  const discard = () => {
    setAdding(false);
    setInputValue("");
  };

  const confirm = async () => {
    try {
      setLoading(true);

      if (projectId) {
        await addMemberToProject({
          projectId,
          userId,
          memberEmail: inputValue,
        });
      }

      discard();

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
        {isAdding ? (
          <input
            className="h-[40px] w-full text-center focus:outline-none"
            type="text"
            placeholder={`enter email`}
            maxLength={320}
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />
        ) : (
          <button className="h-[40px]" onClick={() => setAdding(true)}>
            add member
          </button>
        )}
      </div>
      {isAdding && (
        <div className="flex border-b border-[var(--font-color)]">
          <button
            disabled={isLoading}
            onClick={() => discard()}
            className="h-[40px] flex-grow disabled:pointer-events-none disabled:opacity-50"
          >
            discard
          </button>
          <button
            disabled={isLoading}
            onClick={() => confirm()}
            className="h-[40px] flex-grow bg-[var(--font-color)] text-white disabled:pointer-events-none disabled:opacity-50"
          >
            confirm
          </button>
        </div>
      )}
    </>
  );
};
