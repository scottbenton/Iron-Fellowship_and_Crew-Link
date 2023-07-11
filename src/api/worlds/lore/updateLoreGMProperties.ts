import { setDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { GMLoreDocument } from "types/Lore.type";
import { getPrivateDetailsLoreDoc } from "./_getRef";

interface Params {
  worldId: string;
  loreId: string;
  loreGMProperties: Partial<GMLoreDocument>;
}

export const updateLoreGMProperties: ApiFunction<Params, boolean> = (
  params
) => {
  const { worldId, loreId, loreGMProperties } = params;

  return new Promise((resolve, reject) => {
    setDoc(getPrivateDetailsLoreDoc(worldId, loreId), loreGMProperties, {
      merge: true,
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update lore.");
      });
  });
};

export function useUpdateLoreGMProperties() {
  const { call, ...rest } = useApiState(updateLoreGMProperties);

  return {
    updateLoreGMProperties: call,
    ...rest,
  };
}
