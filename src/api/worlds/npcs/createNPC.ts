import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { addDoc, Timestamp } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getNPCCollection } from "./_getRef";

export const createNPC: ApiFunction<
  { uid?: string; worldId: string },
  string
> = (params) => {
  const { uid, worldId } = params;
  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }

    addDoc(getNPCCollection(uid, worldId), {
      name: "New NPC",
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

export function useCreateNPC() {
  const { call, ...rest } = useApiState(createNPC);

  return {
    createNPC: (uid: string, worldId: string) => call({ uid, worldId }),
    ...rest,
  };
}
