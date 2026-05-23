import { getDocs } from "firebase/firestore";
import {
  getCampaignAssetCollection,
  getCharacterAssetCollection,
} from "./_getRef";
import { AssetDocument } from "api-calls/assets/_asset.type";
import { createApiFunction } from "api-calls/createApiFunction";

interface GetAssetsParams {
  campaignId?: string;
  characterId?: string;
}

export const getAssets = createApiFunction<GetAssetsParams, AssetDocument[]>(async (params) => {
  const { characterId, campaignId } = params;

  if (!characterId && !campaignId) {
    console.warn("Neither character nor campaign ID provided. Returning empty asset list.");
    return [];
  }

  const collectionRef = characterId
    ? getCharacterAssetCollection(characterId)
    : getCampaignAssetCollection(campaignId!);

  const querySnapshot = await getDocs(collectionRef);
  return querySnapshot.docs.map(doc => doc.data() as AssetDocument);
}, "Error fetching assets");
