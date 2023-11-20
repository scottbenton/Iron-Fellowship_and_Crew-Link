import { deleteDoc } from "firebase/firestore";
import {
  constructLoreImagesPath,
  getLoreDoc,
  getPrivateDetailsLoreDoc,
  getPublicNotesLoreDoc,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { deleteImage } from "lib/storage.lib";

interface Params {
  worldId: string;
  loreId: string;
  imageFilename?: string;
}

export const deleteLore = createApiFunction<Params, void>((params) => {
  const { worldId, loreId, imageFilename } = params;

  return new Promise((resolve, reject) => {
    const promises: Promise<unknown>[] = [];
    promises.push(deleteDoc(getLoreDoc(worldId, loreId)));
    promises.push(deleteDoc(getPrivateDetailsLoreDoc(worldId, loreId)));
    promises.push(deleteDoc(getPublicNotesLoreDoc(worldId, loreId)));
    if (imageFilename) {
      promises.push(
        deleteImage(constructLoreImagesPath(worldId, loreId), imageFilename)
      );
    }

    Promise.all(promises)
      .then(() => resolve())
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to delete lore document.");
