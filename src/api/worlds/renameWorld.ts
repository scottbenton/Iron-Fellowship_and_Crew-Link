import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "providers/AuthProvider";
import { getWorldDoc } from "./_getRef";

export const renameWorld: ApiFunction<
  { uid?: string; worldId: string; worldName: string },
  boolean
> = (params) => {
  const { uid, worldId, worldName } = params;

  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }

    updateDoc(getWorldDoc(uid, worldId), { name: worldName })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject(e);
      });
  });
};

export function useRenameWorld() {
  const { call, loading, error } = useApiState(renameWorld);

  const uid = useAuth().user?.uid;

  return {
    renameWorld: (worldId: string, worldName: string) =>
      call({ uid, worldId, worldName }),
    loading,
    error,
  };
}
