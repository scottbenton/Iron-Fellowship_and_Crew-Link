import { constructLoreImagesPath, getLoreDoc } from "./_getRef";
import {
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_LABEL,
  uploadImage,
} from "lib/storage.lib";
import { updateDoc } from "firebase/firestore";
import { createApiFunction } from "api-calls/createApiFunction";

export const uploadLoreImage = createApiFunction<
  { worldId: string; loreId: string; image: File },
  void
>((params) => {
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
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to upload image");
