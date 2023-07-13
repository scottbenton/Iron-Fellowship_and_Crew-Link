import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { LoreDocument } from "types/Lore.type";
import { convertToDatabase, getLoreDoc } from "./_getRef";

interface LoreParams {
  worldId: string;
  loreId: string;
  lore: Partial<LoreDocument>;
}

export const updateLore: ApiFunction<LoreParams, boolean> = (params) => {
  const { worldId, loreId, lore } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getLoreDoc(worldId, loreId), convertToDatabase(lore))
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update lore");
      });
  });
};

export function useUpdateLore() {
  const { call, ...rest } = useApiState(updateLore);

  return {
    updateLore: (params: LoreParams) => call(params),
    ...rest,
  };
}
