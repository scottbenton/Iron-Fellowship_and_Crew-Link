import { deleteDoc } from "firebase/firestore";
import { getPrivateSectorLocationNotesDoc, getPublicSectorLocationNotesDoc, getSectorLocationDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

interface Params {
  worldId: string;
  sectorId: string;
  locationId: string;
}

export const deleteSectorLocation = createApiFunction<Params, void>(
  (params) => {
    const { worldId, sectorId, locationId } = params;

    return new Promise((resolve, reject) => {
      let promises: Promise<any>[] = [];
      promises.push(
        deleteDoc(getSectorLocationDoc(worldId, sectorId, locationId))
      );
      promises.push(
        deleteDoc(
          getPublicSectorLocationNotesDoc(worldId, sectorId, locationId)
        )
      );
      promises.push(
        deleteDoc(
          getPrivateSectorLocationNotesDoc(worldId, sectorId, locationId)
        )
      );

      Promise.all(promises)
        .then(() => resolve())
        .catch((e) => {
          reject(e);
        });
    });
  },
  "Failed to delete location."
);
