import { validateRequest } from "@/lib/auth";
import Link from "next/link";
import { CreateFolderButton } from "@/components/button-create-folder";
import { ProjectList } from "@/components/list-project";

export default async function Home() {
  const { user } = await validateRequest();

  return (
    <main>
      <div className="flex flex-col">
        {user ? (
          <>
            <CreateFolderButton userId={user.id}>create project</CreateFolderButton>
            <ProjectList userId={user.id} />
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
