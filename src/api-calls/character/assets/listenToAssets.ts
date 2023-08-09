import { onSnapshot } from "firebase/firestore";
import { getCharacterAssetCollection } from "./_getRef";
import { StoredAsset } from "types/Asset.type";

export function listenToAssets(
  characterId: string,
  onAssets: (assets: { [assetId: string]: StoredAsset }) => void,
  onError: (error: any) => void
) {
  return onSnapshot(
    getCharacterAssetCollection(characterId),
    (snapshot) => {
      const assetMap: { [assetId: string]: StoredAsset } = {};

      snapshot.docs.forEach((doc) => (assetMap[doc.id] = doc.data()));
      onAssets(assetMap);
    },
    (error) => onError(error)
  );
}
