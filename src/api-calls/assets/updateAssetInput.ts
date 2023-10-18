import { updateDoc } from "firebase/firestore";
import { getCampaignAssetDoc, getCharacterAssetDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateAssetInput = createApiFunction<
  {
    characterId?: string;
    campaignId?: string;
    assetId: string;
    inputLabel: string;
    inputValue: string;
  },
  void
>((params) => {
  const { characterId, campaignId, assetId, inputLabel, inputValue } = params;
  return new Promise((resolve, reject) => {
    if (!characterId && !campaignId) {
      reject(new Error("Either character or campaign ID must be defined."));
      return;
    }

    updateDoc(
      characterId
        ? getCharacterAssetDoc(characterId, assetId)
        : getCampaignAssetDoc(campaignId as string, assetId),
      // @ts-ignore
      {
        [`inputs.${inputLabel}`]: inputValue,
      }
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Error updating asset input");
