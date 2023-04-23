import { deleteDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getLocationDoc } from "./_getRef";

interface Params {
  worldOwnerId: string;
  worldId: string;
  locationId: string;
}

export const deleteLocation: ApiFunction<Params, boolean> = (params) => {
  const { worldOwnerId, worldId, locationId } = params;

  return new Promise((resolve, reject) => {
    deleteDoc(getLocationDoc(worldOwnerId, worldId, locationId))
      .then(() => resolve(true))
      .catch((e) => {
        console.error(e);
        reject("Failed to delete location");
      });
  });
};

export function useDeleteLocation() {
  const { call, ...rest } = useApiState(deleteLocation);

  return {
    deleteLocation: call,
    ...rest,
  };
}
