import { constructLoreImagesPath, getLoreDoc } from "./_getRef";
import { replaceImage } from "lib/storage.lib";
import { updateDoc } from "firebase/firestore";
import { createApiFunction } from "api-calls/createApiFunction";

export const uploadLoreImage = createApiFunction<
  { worldId: string; loreId: string; image: File; oldImageFilename?: string },
  void
>((params) => {
  const { worldId, loreId, image, oldImageFilename } = params;

  return new Promise((resolve, reject) => {
    replaceImage(
      constructLoreImagesPath(worldId, loreId),
      oldImageFilename,
      image
    )
      .then(() => {
        const filename = image.name;
        updateDoc(getLoreDoc(worldId, loreId), {
          imageFilenames: [filename],
        })
          .then(() => {
            resolve();
          })
          .catch(reject);
      })
      .catch(reject);
  });
}, "Failed to upload image");
