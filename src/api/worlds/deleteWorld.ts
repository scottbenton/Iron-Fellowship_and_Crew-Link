import { deleteDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getWorldDoc } from "./_getRef";

export const deleteWorld: ApiFunction<string, boolean> = (worldId) => {
  return new Promise((resolve, reject) => {
    deleteDoc(getWorldDoc(worldId))
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
  const { call, ...rest } = useApiState(deleteWorld);

  return {
    deleteWorld: (worldId: string) => call(worldId),
    ...rest,
  };
}
