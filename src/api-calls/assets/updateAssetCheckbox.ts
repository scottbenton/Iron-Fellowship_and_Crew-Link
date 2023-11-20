import { updateDoc } from "firebase/firestore";
import { getCampaignAssetDoc, getCharacterAssetDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateAssetCheckbox = createApiFunction<
  {
    characterId?: string;
    campaignId?: string;
    assetId: string;
    abilityIndex: number;
    checked: boolean;
  },
  void
>((params) => {
  const { characterId, campaignId, assetId, abilityIndex, checked } = params;

  return new Promise((resolve, reject) => {
    if (!characterId && !campaignId) {
      reject("Either campaign or character ID must be defined.");
      return;
    }
    updateDoc(
      characterId
        ? getCharacterAssetDoc(characterId, assetId)
        : getCampaignAssetDoc(campaignId as string, assetId),
      //@ts-expect-error - typescript doesn't like this notation
      {
        [`enabledAbilities.${abilityIndex}`]: checked,
      }
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Error updating asset ability.");
