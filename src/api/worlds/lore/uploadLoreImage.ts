import { ApiFunction, useApiState } from "hooks/useApiState";
import { constructLoreImagesPath, getLoreDoc } from "./_getRef";
import {
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_LABEL,
  uploadImage,
} from "lib/storage.lib";
import { updateDoc } from "firebase/firestore";

export const uploadLoreImage: ApiFunction<
  { worldId: string; loreId: string; image: File },
  boolean
> = (params) => {
  const { worldId, loreId, image } = params;

  return new Promise((resolve, reject) => {
    const filename = image.name;

    if (image.size > MAX_FILE_SIZE) {
      reject(`Image must be smaller than ${MAX_FILE_SIZE_LABEL} in size.`);
      return;
    }

    uploadImage(constructLoreImagesPath(worldId, loreId), image)
      .then(() => {
        updateDoc(getLoreDoc(worldId, loreId), {
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

export function useUploadLoreImage() {
  const { call, ...rest } = useApiState(uploadLoreImage);

  return {
    uploadLoreImage: call,
    ...rest,
  };
}
