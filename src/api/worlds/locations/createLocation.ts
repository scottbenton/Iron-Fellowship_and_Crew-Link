import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getLocationCollection } from "./_getRef";

export const createLocation: ApiFunction<
  { worldId: string; shared?: boolean },
  string
> = (params) => {
  const { worldId } = params;
  return new Promise((resolve, reject) => {
    addDoc(getLocationCollection(worldId), {
      name: "New Location",
      sharedWithPlayers: true,
      updatedTimestamp: Timestamp.now(),
    })
      .then((doc) => {
        resolve(doc.id);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to create new location");
      });
  });
};

export function useCreateLocation() {
  const { call, ...rest } = useApiState(createLocation);

  return {
    createLocation: (worldId: string) => call({ worldId }),
    ...rest,
  };
}
