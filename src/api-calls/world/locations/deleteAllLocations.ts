import { deleteDoc, getDocs } from "firebase/firestore";
import {
  getLocationCollection,
  getLocationDoc,
  getPrivateDetailsLocationDoc,
  getPublicNotesLocationDoc,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

interface Params {
  worldId: string;
}

export const deleteAllLocations = createApiFunction<Params, void>((params) => {
  const { worldId } = params;

  return new Promise((resolve, reject) => {
    let promises: Promise<any>[] = [];
    getDocs(getLocationCollection(worldId))
      .then((docs) => {
        docs.forEach((doc) => {
          promises.push(deleteDoc(getLocationDoc(worldId, doc.id)));
          promises.push(
            deleteDoc(getPrivateDetailsLocationDoc(worldId, doc.id))
          );
          promises.push(deleteDoc(getPublicNotesLocationDoc(worldId, doc.id)));
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
}, "Failed to delete locations.");
