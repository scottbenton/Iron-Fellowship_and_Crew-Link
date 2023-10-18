import { addDoc } from "firebase/firestore";
import {
  getCampaignAssetCollection,
  getCharacterAssetCollection,
} from "./_getRef";
import { StoredAsset } from "types/Asset.type";
import { createApiFunction } from "api-calls/createApiFunction";

interface AddAssetParams {
  campaignId?: string;
  characterId?: string;
  asset: StoredAsset;
}

export const addAsset = createApiFunction<AddAssetParams, void>((params) => {
  const { characterId, campaignId, asset } = params;

  return new Promise((resolve, reject) => {
    if (!characterId && !campaignId) {
      reject("Either character or campaign ID must be defined.");
      return;
    }
    addDoc(
      characterId
        ? getCharacterAssetCollection(characterId)
        : getCampaignAssetCollection(campaignId as string),
      asset
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Error creating your asset");
