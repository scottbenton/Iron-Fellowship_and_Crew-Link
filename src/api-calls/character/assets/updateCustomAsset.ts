import { updateDoc } from "firebase/firestore";
import { getCharacterAssetDoc } from "./_getRef";
import type { Asset } from "dataforged";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateCustomAsset = createApiFunction<
  {
    characterId: string;
    assetId: string;
    asset: Asset;
  },
  void
>((params) => {
  const { characterId, assetId, asset } = params;

  return new Promise((resolve, reject) => {
    updateDoc(getCharacterAssetDoc(characterId, assetId), {
      customAsset: asset as any,
    })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Error updating custom asset.");
