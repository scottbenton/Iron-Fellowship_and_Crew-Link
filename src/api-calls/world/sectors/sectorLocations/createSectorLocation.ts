import { addDoc } from "firebase/firestore";
import { getSectorLocationsCollection } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { StarforgedLocation } from "types/LocationStarforged.type";

export const createSectorLocation = createApiFunction<
  {
    worldId: string;
    sectorId: string;
    location: StarforgedLocation;
  },
  string
>((params) => {
  const { worldId, sectorId, location } = params;
  return new Promise((resolve, reject) => {
    addDoc(getSectorLocationsCollection(worldId, sectorId), location)
      .then((doc) => {
        resolve(doc.id);
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to create a new location.");
