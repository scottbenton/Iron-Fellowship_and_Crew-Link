import { createApiFunction } from "api-calls/createApiFunction";
import { PartialWithFieldValue, updateDoc } from "firebase/firestore";
import { getHomebrewAssetCollectionDoc } from "./_getRef";
import { StoredHomebrewAssetCollection } from "types/Asset.type";

export const updateHomebrewAssetCollection = createApiFunction<
  {
    assetCollectionId: string;
    assetCollection: PartialWithFieldValue<StoredHomebrewAssetCollection>;
  },
  void
>((params) => {
  const { assetCollectionId, assetCollection } = params;
  return new Promise((resolve, reject) => {
    updateDoc(getHomebrewAssetCollectionDoc(assetCollectionId), assetCollection)
      .then(() => resolve())
      .catch(reject);
  });
}, "Failed to update asset collection.");
