import { CreateFolderButton } from "@/components/button-create-folder";
import { UploadImageButton } from "@/components/button-upload-image";
import { FoldersNImagesList } from "@/components/list-folders-n-images";
import { getAllFoldersFromFolder } from "@/lib/db/handlers/folder";
import { getAllImagesFromFolder } from "@/lib/db/handlers/image";

const FolderPage = async ({ params }: { params: { projectId: string; folderId: string } }) => {
  const images = await getAllImagesFromFolder({ folderId: params.folderId });
  const folders = await getAllFoldersFromFolder({ parentFolderId: params.folderId });

  return (
    <div>
      <div className="flex w-full flex-col">
        <CreateFolderButton folderId={params.folderId} projectId={params.projectId}>
          create folder
        </CreateFolderButton>
        <UploadImageButton folderId={params.folderId} projectId={params.projectId} />
      </div>
      <FoldersNImagesList folders={folders} images={images} />
    </div>
  );
};

export default FolderPage;
