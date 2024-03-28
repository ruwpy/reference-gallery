import { CreateFolderButton } from "@/components/button-create-folder";
import { UploadImageButton } from "@/components/button-upload-image";
import { FoldersNImagesList } from "@/components/list-folders-n-images";
import { validateRequest } from "@/lib/auth";
import { getAllFoldersFromFolder } from "@/lib/db/handlers/folder";
import { getAllImagesFromFolder } from "@/lib/db/handlers/image";
import { redirect } from "next/navigation";

const FolderPage = async ({ params }: { params: { projectId: string; folderIds: string[] } }) => {
  const { user } = await validateRequest();

  if (!user) return redirect("/");

  const folderId = params.folderIds[params.folderIds.length - 1];

  const images = await getAllImagesFromFolder({
    folderId,
  });
  const folders = await getAllFoldersFromFolder({
    parentFolderId: folderId,
  });

  return (
    <div>
      <div className="flex w-full flex-col">
        <CreateFolderButton folderId={folderId} projectId={params.projectId}>
          create folder
        </CreateFolderButton>
        <UploadImageButton folderId={folderId} projectId={params.projectId} />
      </div>
      <FoldersNImagesList userId={user.id} folders={folders} images={images} />
    </div>
  );
};

export default FolderPage;
