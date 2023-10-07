import { updateDoc } from "firebase/firestore";
import { getCharacterAssetDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateAssetCondition = createApiFunction<
  {
    characterId: string;
    assetId: string;
    condition: string;
    checked: boolean;
  },
  void
>((params) => {
  const { characterId, assetId, condition, checked } = params;
  return new Promise((resolve, reject) => {
    //@ts-ignore
    updateDoc(getCharacterAssetDoc(characterId, assetId), {
      [`conditions.${condition}`]: checked,
    })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Error updating asset condition");
