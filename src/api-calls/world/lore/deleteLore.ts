import { deleteDoc } from "firebase/firestore";
import {
  getLoreDoc,
  getPrivateDetailsLoreDoc,
  getPublicNotesLoreDoc,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

interface Params {
  worldId: string;
  loreId: string;
}

export const deleteLore = createApiFunction<Params, void>((params) => {
  const { worldId, loreId } = params;

  return new Promise((resolve, reject) => {
    let promises: Promise<any>[] = [];
    promises.push(deleteDoc(getLoreDoc(worldId, loreId)));
    promises.push(deleteDoc(getPrivateDetailsLoreDoc(worldId, loreId)));
    promises.push(deleteDoc(getPublicNotesLoreDoc(worldId, loreId)));

    Promise.all(promises)
      .then(() => resolve())
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to delete lore document.");
