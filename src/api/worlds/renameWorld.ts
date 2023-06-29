import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getWorldDoc } from "./_getRef";

export const renameWorld: ApiFunction<
  { worldId: string; worldName: string },
  boolean
> = (params) => {
  const { worldId, worldName } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getWorldDoc(worldId), { name: worldName })
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

  return {
    renameWorld: (worldId: string, worldName: string) =>
      call({ worldId, worldName }),
    loading,
    error,
  };
}
