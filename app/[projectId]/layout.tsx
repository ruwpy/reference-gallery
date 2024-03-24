import { Path } from "@/components/path";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

const ProjectLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string; folderId: string };
}) => {
  const { user } = await validateRequest();

  if (!user) redirect("/");

  return (
    <>
      <Path />
      {children}
    </>
  );
};

export default ProjectLayout;
