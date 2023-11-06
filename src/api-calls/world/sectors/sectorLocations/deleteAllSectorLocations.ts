import { getDocs } from "firebase/firestore";
import { getSectorLocationDoc, getSectorLocationsCollection } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { deleteSectorLocation } from "./deleteSectorLocation";

interface Params {
  worldId: string;
  sectorId: string;
}

export const deleteAllSectorLocations = createApiFunction<Params, void>(
  (params) => {
    const { worldId, sectorId } = params;

    return new Promise((resolve, reject) => {
      let promises: Promise<any>[] = [];
      getDocs(getSectorLocationsCollection(worldId, sectorId))
        .then((docs) => {
          docs.forEach((doc) => {
            promises.push(
              deleteSectorLocation({ worldId, sectorId, locationId: doc.id })
            );
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
  "Failed to delete locations."
);
