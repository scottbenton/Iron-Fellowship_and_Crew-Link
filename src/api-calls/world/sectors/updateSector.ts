import { updateDoc } from "firebase/firestore";
import { convertToDatabase, getSectorDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { Sector } from "types/Sector.type";

interface Params {
  worldId: string;
  sectorId: string;
  sector: Partial<Sector>;
}

export const updateSector = createApiFunction<Params, void>((params) => {
  const { worldId, sectorId, sector } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getSectorDoc(worldId, sectorId), convertToDatabase(sector))
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update sector.");
