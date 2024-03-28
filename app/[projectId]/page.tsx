import { CreateFolderButton } from "@/components/button-create-folder";
import { UploadImageButton } from "@/components/button-upload-image";
import { FoldersNImagesList } from "@/components/list-folders-n-images";
import { validateRequest } from "@/lib/auth";
import { getAllFoldersFromProject } from "@/lib/db/handlers/folder";
import { getAllImagesFromProject } from "@/lib/db/handlers/image";
import { redirect } from "next/navigation";

const ProjectPage = async ({ params }: { params: { projectId: string } }) => {
  const { user } = await validateRequest();

  if (!user) return redirect("/");

  const images = await getAllImagesFromProject({ projectId: params.projectId });
  const folders = await getAllFoldersFromProject({ projectId: params.projectId });

  return (
    <>
      <div className="flex">
        <div className="flex w-full flex-col">
          <CreateFolderButton projectId={params.projectId}>create folder</CreateFolderButton>
          <UploadImageButton projectId={params.projectId} />
        </div>
      </div>
      <FoldersNImagesList userId={user.id} folders={folders} images={images} />
    </>
  );
};

export default ProjectPage;
