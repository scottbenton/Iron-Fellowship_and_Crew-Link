import { deleteDoc } from "firebase/firestore";
import {
  getLocationDoc,
  getPrivateDetailsLocationDoc,
  getPublicNotesLocationDoc,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

interface Params {
  worldId: string;
  locationId: string;
}

export const deleteLocation = createApiFunction<Params, void>((params) => {
  const { worldId, locationId } = params;

  return new Promise((resolve, reject) => {
    let promises: Promise<any>[] = [];
    promises.push(deleteDoc(getLocationDoc(worldId, locationId)));
    promises.push(deleteDoc(getPrivateDetailsLocationDoc(worldId, locationId)));
    promises.push(deleteDoc(getPublicNotesLocationDoc(worldId, locationId)));

    Promise.all(promises)
      .then(() => resolve())
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to delete location.");
