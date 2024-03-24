import { getProjects } from "@/lib/db/handlers/project";
import Link from "next/link";

export const ProjectList = async ({ userId }: { userId: string }) => {
  const projects = (await getProjects({ userId })).reverse();

  return (
    <div className="grid grid-cols-4">
      {projects.map((p) => (
        <Link href={`/${p.project.id}`} key={p.project.id}>
          <div className="aspect-square p-[4px] flex flex-col justify-between border-r border-b border-[var(--font-color)]">
            <span className="opacity-50">project</span>
            <span className="text-[18px] break-words">{p.project.name}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};
