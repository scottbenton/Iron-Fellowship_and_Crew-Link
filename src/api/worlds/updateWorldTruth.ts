import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { updateDoc } from "firebase/firestore";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "hooks/useAuth";
import { Truth } from "types/World.type";
import { getWorldDoc } from "./_getRef";

export const updateWorldTruth: ApiFunction<
  { uid?: string; worldId: string; truthId: string; truth: Truth },
  boolean
> = (params) => {
  const { uid, worldId, truthId, truth } = params;

  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }

    updateDoc(getWorldDoc(uid, worldId), {
      [`truths.${encodeDataswornId(truthId)}`]: truth,
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update world truth");
      });
  });
};

export function useUpdateWorldTruth() {
  const { call, loading, error } = useApiState(updateWorldTruth);

  const uid = useAuth().user?.uid;

  return {
    updateWorldTruth: (worldId: string, truthId: string, truth: Truth) =>
      call({ uid, worldId, truthId, truth }),
    loading,
    error,
  };
}
