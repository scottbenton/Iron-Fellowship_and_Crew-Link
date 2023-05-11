import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getLocationCollection } from "./_getRef";

export const createLocation: ApiFunction<
  { uid?: string; worldId: string },
  string
> = (params) => {
  const { uid, worldId } = params;
  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }

    addDoc(getLocationCollection(uid, worldId), {
      name: "New Location",
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
    createLocation: (uid: string, worldId: string) => call({ uid, worldId }),
    ...rest,
  };
}
