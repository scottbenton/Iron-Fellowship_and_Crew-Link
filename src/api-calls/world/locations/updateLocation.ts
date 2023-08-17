import { updateDoc } from "firebase/firestore";
import { LocationDocument } from "types/Locations.type";
import { convertToDatabase, getLocationDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

interface LocationParams {
  worldId: string;
  locationId: string;
  location: Partial<LocationDocument>;
}

export const updateLocation = createApiFunction<LocationParams, void>(
  (params) => {
    const { worldId, locationId, location } = params;

    return new Promise((resolve, reject) => {
      updateDoc(
        getLocationDoc(worldId, locationId),
        convertToDatabase(location)
      )
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  "Failed to update location."
);
