import { createApiFunction } from "api-calls/createApiFunction";
import { addDoc } from "firebase/firestore";
import { StoredHomebrewAssetCollection } from "types/Asset.type";
import { getHomebrewAssetCollectionCollection } from "./_getRef";

export const createHomebrewAssetCollection = createApiFunction<
  { assetCollection: StoredHomebrewAssetCollection },
  void
>((params) => {
  const { assetCollection } = params;

  return new Promise((resolve, reject) => {
    addDoc(getHomebrewAssetCollectionCollection(), assetCollection)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to create asset collection.");
