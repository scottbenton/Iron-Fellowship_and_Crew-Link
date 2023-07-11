import { ApiFunction, useApiState } from "hooks/useApiState";
import { constructNPCImagesPath, getNPCDoc } from "./_getRef";
import {
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_LABEL,
  uploadImage,
} from "lib/storage.lib";
import { updateDoc } from "firebase/firestore";

export const uploadNPCImage: ApiFunction<
  { worldId: string; npcId: string; image: File },
  boolean
> = (params) => {
  const { worldId, npcId, image } = params;

  return new Promise((resolve, reject) => {
    const filename = image.name;

    if (image.size > MAX_FILE_SIZE) {
      reject(`Image must be smaller than ${MAX_FILE_SIZE_LABEL} in size.`);
      return;
    }

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
