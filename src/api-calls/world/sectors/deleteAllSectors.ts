import { deleteDoc, getDocs } from "firebase/firestore";
import { getSectorDoc, getSectorCollection } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { deleteAllSectorLocations } from "./sectorLocations/deleteAllSectorLocations";

interface Params {
  worldId: string;
}

export const deleteAllSectors = createApiFunction<Params, void>((params) => {
  const { worldId } = params;

  return new Promise((resolve, reject) => {
    const promises: Promise<unknown>[] = [];
    getDocs(getSectorCollection(worldId))
      .then((docs) => {
        docs.forEach((doc) => {
          promises.push(
            deleteAllSectorLocations({
              worldId,
              sectorId: doc.id,
            })
          );
          promises.push(deleteDoc(getSectorDoc(worldId, doc.id)));
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
}, "Failed to delete sectors.");
