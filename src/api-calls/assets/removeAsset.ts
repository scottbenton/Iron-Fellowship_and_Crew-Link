import { deleteDoc } from "firebase/firestore";
import { getCampaignAssetDoc, getCharacterAssetDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const removeAsset = createApiFunction<
  {
    characterId?: string;
    campaignId?: string;
    assetId: string;
  },
  void
>((params) => {
  const { characterId, campaignId, assetId } = params;

  return new Promise((resolve, reject) => {
    if (!characterId && !campaignId) {
      reject(new Error("Either character or campaign ID must be defined"));
      return;
    }
    deleteDoc(
      characterId
        ? getCharacterAssetDoc(characterId, assetId)
        : getCampaignAssetDoc(campaignId as string, assetId)
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Error removing asset");
