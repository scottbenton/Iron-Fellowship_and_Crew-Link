import { createApiFunction } from "api-calls/createApiFunction";
import { addDoc } from "firebase/firestore";
import { getHomebrewAssetCollection } from "./_getRef";
import { StoredHomebrewAsset } from "types/Asset.type";

export const createHomebrewAsset = createApiFunction<
  { asset: StoredHomebrewAsset },
  void
>((params) => {
  const { asset } = params;
  return new Promise((resolve, reject) => {
    addDoc(getHomebrewAssetCollection(), asset)
      .then(() => resolve())
      .catch(reject);
  });
}, "Failed to create asset.");
