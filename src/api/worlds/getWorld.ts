import { getDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "../../hooks/useApiState";
import { decodeWorld, getWorldDoc } from "./_getRef";
import { World, Truth, TRUTH_IDS } from "types/World.type";
import { decodeDataswornId } from "functions/dataswornIdEncoder";

export const getWorld: ApiFunction<
  {
    uid: string;
    worldId: string;
  },
  World
> = function (params) {
  return new Promise((resolve, reject) => {
    const { uid, worldId } = params;

    getDoc(getWorldDoc(uid, worldId))
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
