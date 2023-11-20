import { constructLocationImagesPath, getLocationDoc } from "./_getRef";
import { replaceImage } from "lib/storage.lib";
import { updateDoc } from "firebase/firestore";
import { createApiFunction } from "api-calls/createApiFunction";

export const uploadLocationImage = createApiFunction<
  {
    worldId: string;
    locationId: string;
    image: File;
    oldImageFilename?: string;
  },
  void
>((params) => {
  const { worldId, locationId, image, oldImageFilename } = params;

  return new Promise((resolve, reject) => {
    replaceImage(
      constructLocationImagesPath(worldId, locationId),
      oldImageFilename,
      image
    )
      .then(() => {
        const filename = image.name;
        updateDoc(getLocationDoc(worldId, locationId), {
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
