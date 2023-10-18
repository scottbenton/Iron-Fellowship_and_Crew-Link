import { updateDoc } from "firebase/firestore";
import { getCampaignAssetDoc, getCharacterAssetDoc } from "./_getRef";
import type { Asset } from "dataforged";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateCustomAsset = createApiFunction<
  {
    characterId?: string;
    campaignId?: string;
    assetId: string;
    asset: Asset;
  },
  void
>((params) => {
  const { characterId, campaignId, assetId, asset } = params;

  return new Promise((resolve, reject) => {
    if (!characterId && !campaignId) {
      reject(new Error("Either character or campaign ID must be defined"));
      return;
    }
    updateDoc(
      characterId
        ? getCharacterAssetDoc(characterId, assetId)
        : getCampaignAssetDoc(campaignId as string, assetId),
      {
        customAsset: asset as any,
      }
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Error updating custom asset.");
