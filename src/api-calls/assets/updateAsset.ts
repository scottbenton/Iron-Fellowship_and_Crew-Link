import { PartialWithFieldValue, updateDoc } from "firebase/firestore";
import { getCampaignAssetDoc, getCharacterAssetDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { StoredAsset } from "types/Asset.type";

export const updateAsset = createApiFunction<
  {
    characterId?: string;
    campaignId?: string;
    assetId: string;
    asset: PartialWithFieldValue<StoredAsset>;
  },
  void
>((params) => {
  const { characterId, campaignId, assetId, asset } = params;

  return new Promise((resolve, reject) => {
    if (!characterId && !campaignId) {
      reject("Either campaign or character ID must be defined.");
      return;
    }
    updateDoc(
      characterId
        ? getCharacterAssetDoc(characterId, assetId)
        : getCampaignAssetDoc(campaignId as string, assetId),
      asset
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Error updating asset.");
