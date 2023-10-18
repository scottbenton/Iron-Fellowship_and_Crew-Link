import { updateDoc } from "firebase/firestore";
import { getCampaignAssetDoc, getCharacterAssetDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateAssetCondition = createApiFunction<
  {
    characterId?: string;
    campaignId?: string;
    assetId: string;
    condition: string;
    checked: boolean;
  },
  void
>((params) => {
  const { characterId, campaignId, assetId, condition, checked } = params;
  return new Promise((resolve, reject) => {
    if (!characterId && !campaignId) {
      reject("Either character or campaign ID must be defined");
      return;
    }
    updateDoc(
      characterId
        ? getCharacterAssetDoc(characterId, assetId)
        : getCampaignAssetDoc(campaignId as string, assetId),
      // @ts-ignore
      {
        [`conditions.${condition}`]: checked,
      }
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Error updating asset condition");
