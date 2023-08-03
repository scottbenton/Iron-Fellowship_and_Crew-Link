import { addDoc } from "firebase/firestore";
import { getCharacterAssetCollection } from "./_getRef";
import { StoredAsset } from "types/Asset.type";
import { createApiFunction } from "api-calls/createApiFunction";

interface AddAssetParams {
  uid: string;
  characterId: string;
  asset: StoredAsset;
}

export const addAsset = createApiFunction<AddAssetParams, void>((params) => {
  const { uid, characterId, asset } = params;
  return new Promise((resolve, reject) => {
    addDoc(getCharacterAssetCollection(uid, characterId), asset)
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Error creating your asset");
