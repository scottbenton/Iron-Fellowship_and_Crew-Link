import { updateDoc } from "firebase/firestore";
import { getCharacterAssetDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateAssetCheckbox = createApiFunction<
  {
    characterId: string;
    assetId: string;
    abilityIndex: number;
    checked: boolean;
  },
  void
>((params) => {
  const { characterId, assetId, abilityIndex, checked } = params;
  return new Promise((resolve, reject) => {
    // @ts-ignore
    updateDoc(getCharacterAssetDoc(characterId, assetId), {
      [`enabledAbilities.${abilityIndex}`]: checked,
    })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Error updating asset ability.");
