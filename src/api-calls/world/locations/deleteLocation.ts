import { deleteDoc } from "firebase/firestore";
import {
  constructLocationImagesPath,
  getLocationDoc,
  getPrivateDetailsLocationDoc,
  getPublicNotesLocationDoc,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { deleteImage } from "lib/storage.lib";

interface Params {
  worldId: string;
  locationId: string;
  imageFilename?: string;
}

export const deleteLocation = createApiFunction<Params, void>((params) => {
  const { worldId, locationId, imageFilename } = params;

  return new Promise((resolve, reject) => {
    let promises: Promise<any>[] = [];
    promises.push(deleteDoc(getLocationDoc(worldId, locationId)));
    promises.push(deleteDoc(getPrivateDetailsLocationDoc(worldId, locationId)));
    promises.push(deleteDoc(getPublicNotesLocationDoc(worldId, locationId)));
    if (imageFilename) {
      promises.push(
        deleteImage(
          constructLocationImagesPath(worldId, locationId),
          imageFilename
        )
      );
    }
    Promise.all(promises)
      .then(() => resolve())
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to delete location.");
