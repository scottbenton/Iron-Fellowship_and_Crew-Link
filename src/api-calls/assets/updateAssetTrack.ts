import { updateDoc } from "firebase/firestore";
import { getCampaignAssetDoc, getCharacterAssetDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateAssetTrack = createApiFunction<
  {
    characterId?: string;
    campaignId?: string;
    assetId: string;
    value: number;
  },
  void
>((params) => {
  const { characterId, campaignId, assetId, value } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId && !characterId) {
      reject(new Error("Either campaign or character ID must be defined"));
      return;
    }
    updateDoc(
      characterId
        ? getCharacterAssetDoc(characterId, assetId)
        : getCampaignAssetDoc(campaignId as string, assetId),
      {
        trackValue: value,
      }
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Error updating asset track.");
