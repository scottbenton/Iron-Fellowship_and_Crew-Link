import { updateDoc } from "firebase/firestore";
import { LoreDocument } from "types/Lore.type";
import { convertToDatabase, getLoreDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

interface LoreParams {
  worldId: string;
  loreId: string;
  lore: Partial<LoreDocument>;
}

export const updateLore = createApiFunction<LoreParams, void>((params) => {
  const { worldId, loreId, lore } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getLoreDoc(worldId, loreId), convertToDatabase(lore))
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update lore document.");
