import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { LocationDocument } from "types/Locations.type";
import { convertToDatabase, getLocationDoc } from "./_getRef";

interface LocationParams {
  worldOwnerId: string;
  worldId: string;
  locationId: string;
  location: Partial<LocationDocument>;
}

export const updateLocation: ApiFunction<LocationParams, boolean> = (
  params
) => {
  const { worldOwnerId, worldId, locationId, location } = params;

  return new Promise((resolve, reject) => {
    updateDoc(
      getLocationDoc(worldOwnerId, worldId, locationId),
      convertToDatabase(location)
    )
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update location");
      });
  });
};

export function useUpdateLocation() {
  const { call, ...rest } = useApiState(updateLocation);

  return {
    updateLocation: (params: LocationParams) => call(params),
    ...rest,
  };
}
