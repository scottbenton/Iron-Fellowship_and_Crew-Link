import { deleteDoc } from "firebase/firestore";
import { getSectorDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

interface Params {
  worldId: string;
  sectorId: string;
}

export const deleteSector = createApiFunction<Params, void>((params) => {
  const { worldId, sectorId } = params;

  return new Promise((resolve, reject) => {
    let promises: Promise<any>[] = [];
    promises.push(deleteDoc(getSectorDoc(worldId, sectorId)));

    Promise.all(promises)
      .then(() => resolve())
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to delete sector.");
