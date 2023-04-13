import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { deleteDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "providers/AuthProvider";
import { getWorldDoc } from "./_getRef";

export const deleteWorld: ApiFunction<
  { uid?: string; worldId: string },
  boolean
> = (params) => {
  const { uid, worldId } = params;

  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }

    deleteDoc(getWorldDoc(uid, worldId))
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        console.error(err);
        reject("Failed to delete world");
      });
  });
};

export function useDeleteWorld() {
  const uid = useAuth().user?.uid;
  const { call, ...rest } = useApiState(deleteWorld);

  return {
    deleteWorld: (worldId: string) => call({ uid, worldId }),
    ...rest,
  };
}
