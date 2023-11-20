import { onSnapshot } from "firebase/firestore";
import {
  getCampaignAssetCollection,
  getCharacterAssetCollection,
} from "./_getRef";
import { StoredAsset } from "types/Asset.type";

export function listenToAssets(
  characterId: string | undefined,
  campaignId: string | undefined,
  onAssets: (assets: { [assetId: string]: StoredAsset }) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (error: any) => void
) {
  if (!characterId && !campaignId) {
    onError(new Error("Either character or campaign id must be defined."));
    return () => {};
  }
  return onSnapshot(
    characterId
      ? getCharacterAssetCollection(characterId)
      : getCampaignAssetCollection(campaignId as string),
    (snapshot) => {
      const assetMap: { [assetId: string]: StoredAsset } = {};

      snapshot.docs.forEach((doc) => (assetMap[doc.id] = doc.data()));
      onAssets(assetMap);
    },
    (error) => onError(error)
  );
}
