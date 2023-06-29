import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { updateDoc } from "firebase/firestore";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "providers/AuthProvider";
import { Truth } from "types/World.type";
import { getWorldDoc } from "./_getRef";

export const updateWorldTruth: ApiFunction<
  { worldId: string; truthId: string; truth: Truth },
  boolean
> = (params) => {
  const { worldId, truthId, truth } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getWorldDoc(worldId), {
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

  return {
    updateWorldTruth: (worldId: string, truthId: string, truth: Truth) =>
      call({ worldId, truthId, truth }),
    loading,
    error,
  };
}
