import { getDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "../../hooks/useApiState";
import { decodeWorld, getWorldDoc } from "./_getRef";
import { World } from "types/World.type";

export const getWorld: ApiFunction<string, World> = function (worldId) {
  return new Promise((resolve, reject) => {
    getDoc(getWorldDoc(worldId))
      .then((doc) => {
        const data = doc.data();

        if (data) {
          resolve(decodeWorld(data));
        } else {
          reject("World not found");
        }
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to load world");
      });
  });
};

export function useGetWorld() {
  const { call, loading, error, data } = useApiState(getWorld);

  return {
    getWorld: call,
    data,
    loading,
    error,
  };
}
