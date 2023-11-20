import { deleteDoc } from "firebase/firestore";
import {
  getPrivateSectorNotesDoc,
  getPublicSectorNotesDoc,
  getSectorDoc,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { deleteAllSectorLocations } from "./sectorLocations/deleteAllSectorLocations";

interface Params {
  worldId: string;
  sectorId: string;
}

export const deleteSector = createApiFunction<Params, void>((params) => {
  const { worldId, sectorId } = params;

  return new Promise((resolve, reject) => {
    const promises: Promise<unknown>[] = [];
    promises.push(deleteDoc(getSectorDoc(worldId, sectorId)));
    promises.push(deleteAllSectorLocations({ worldId, sectorId }));
    promises.push(deleteDoc(getPublicSectorNotesDoc(worldId, sectorId)));
    promises.push(deleteDoc(getPrivateSectorNotesDoc(worldId, sectorId)));

    Promise.all(promises)
      .then(() => resolve())
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to delete sector.");
