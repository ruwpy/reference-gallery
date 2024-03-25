import { Path } from "@/components/path";
import { validateRequest } from "@/lib/auth";
import { getProject } from "@/lib/db/handlers/project";
import { getAllProjectMembers } from "@/lib/db/handlers/usersToProjects";
import { notFound, redirect } from "next/navigation";

const ProjectLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string; folderId: string };
}) => {
  const { user } = await validateRequest();

  if (!user) return redirect("/");

  const project = await getProject({ projectId: params.projectId });
  const members = await getAllProjectMembers({ projectId: params.projectId });

  const isMember = members.filter((m) => m.userId === user.id)[0] || project.ownerId === user.id;

  if (!isMember) return notFound();

  return (
    <>
      <Path />
      {children}
    </>
  );
};

export default ProjectLayout;
