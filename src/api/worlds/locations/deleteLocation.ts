import { deleteDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import {
  getLocationDoc,
  getPrivateDetailsLocationDoc,
  getPublicNotesLocationDoc,
} from "./_getRef";

interface Params {
  worldOwnerId: string;
  worldId: string;
  locationId: string;
}

export const deleteLocation: ApiFunction<Params, boolean> = (params) => {
  const { worldOwnerId, worldId, locationId } = params;

  return new Promise((resolve, reject) => {
    let promises: Promise<any>[] = [];
    promises.push(deleteDoc(getLocationDoc(worldOwnerId, worldId, locationId)));
    promises.push(
      deleteDoc(getPrivateDetailsLocationDoc(worldOwnerId, worldId, locationId))
    );
    promises.push(
      deleteDoc(getPublicNotesLocationDoc(worldOwnerId, worldId, locationId))
    );

    Promise.all(promises)
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
