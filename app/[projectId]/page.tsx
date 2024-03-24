import { CreateFolderButton } from "@/components/button-create-folder";
import { UploadImageButton } from "@/components/button-upload-image";
import { FoldersNImagesList } from "@/components/list-folders-n-images";
import { getAllFoldersFromProject } from "@/lib/db/handlers/folder";
import { getAllImagesFromProject } from "@/lib/db/handlers/image";

const ProjectPage = async ({ params }: { params: { projectId: string } }) => {
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
      <FoldersNImagesList folders={folders} images={images} />
    </>
  );
};

export default ProjectPage;
