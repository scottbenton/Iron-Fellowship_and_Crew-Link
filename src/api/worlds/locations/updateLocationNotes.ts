import { setDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getPublicNotesLocationDoc } from "./_getRef";

interface Params {
  worldOwnerId: string;
  worldId: string;
  locationId: string;
  notes: string;
}

export const updateLocationNotes: ApiFunction<Params, boolean> = (params) => {
  const { worldOwnerId, worldId, locationId, notes } = params;

  return new Promise((resolve, reject) => {
    setDoc(
      getPublicNotesLocationDoc(worldOwnerId, worldId, locationId),
      { notes },
      { merge: true }
    )
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to save note updates.");
      });
  });
};

export function useUpdateLocationNotes() {
  const { call, ...rest } = useApiState(updateLocationNotes);

  return {
    updateLocationNotes: call,
    ...rest,
  };
}
