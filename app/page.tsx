import { validateRequest } from "@/lib/auth";
import Link from "next/link";
import { CreateFolderButton } from "@/components/button-create-folder";
import { ProjectList } from "@/components/list-project";
import { redirect } from "next/navigation";
import { getProjects } from "@/lib/db/handlers/project";

export default async function Home() {
  const { user } = await validateRequest();

  const projects = await getProjects({ userId: user?.id });

  return (
    <main>
      <div className="flex flex-col">
        {user ? (
          <>
            <CreateFolderButton userId={user.id}>create project</CreateFolderButton>
            <ProjectList userId={user.id} projects={projects || []} />
          </>
        ) : (
          <div className="p-[10px] text-[18px]">
            <span>
              hello, stranger! minding{" "}
              <Link href={"/api/login/google"} className="underline">
                logging in?
              </Link>
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
