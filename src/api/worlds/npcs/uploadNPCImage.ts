import { ApiFunction, useApiState } from "hooks/useApiState";
import { constructNPCImagesPath, getNPCDoc } from "./_getRef";
import { uploadImage } from "lib/storage.lib";
import { updateDoc } from "firebase/firestore";

export const uploadNPCImage: ApiFunction<
  { worldId: string; npcId: string; image: File },
  boolean
> = (params) => {
  const { worldId, npcId, image } = params;

  return new Promise((resolve, reject) => {
    const filename = image.name;

    uploadImage(constructNPCImagesPath(worldId, npcId), image)
      .then(() => {
        updateDoc(getNPCDoc(worldId, npcId), {
          imageFilenames: [filename],
        })
          .then(() => {
            resolve(true);
          })
          .catch((e) => {
            console.error(e);
            reject("Failed to update image");
          });
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to upload image");
      });
  });
};

export function useUploadNPCImage() {
  const { call, ...rest } = useApiState(uploadNPCImage);

  return {
    uploadNPCImage: call,
    ...rest,
  };
}
