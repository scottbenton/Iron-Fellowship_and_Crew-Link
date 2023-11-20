import { deleteDoc, getDocs } from "firebase/firestore";
import {
  getLoreCollection,
  getLoreDoc,
  getPrivateDetailsLoreDoc,
  getPublicNotesLoreDoc,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

interface Params {
  worldId: string;
}

export const deleteAllLoreDocuments = createApiFunction<Params, void>(
  (params) => {
    const { worldId } = params;

    return new Promise((resolve, reject) => {
      const promises: Promise<unknown>[] = [];
      getDocs(getLoreCollection(worldId))
        .then((docs) => {
          docs.forEach((doc) => {
            promises.push(deleteDoc(getLoreDoc(worldId, doc.id)));
            promises.push(deleteDoc(getPrivateDetailsLoreDoc(worldId, doc.id)));
            promises.push(deleteDoc(getPublicNotesLoreDoc(worldId, doc.id)));
          });
        })
        .catch((e) => {
          reject(e);
        });

      Promise.all(promises)
        .then(() => resolve())
        .catch((e) => {
          reject(e);
        });
    });
  },
  "Failed to delete Lore Documents."
);
