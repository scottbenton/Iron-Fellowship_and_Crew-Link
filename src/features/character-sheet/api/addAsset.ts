import { arrayUnion, updateDoc } from "firebase/firestore";
import { firebaseAuth } from "../../../config/firebase.config";
import { getCharacterAssetDoc } from "../../../lib/firebase.lib";
import { StoredAsset } from "../../../types/Asset.type";

export function addAsset(characterId: string, asset: StoredAsset) {
  return new Promise<boolean>((resolve, reject) => {
    const uid = firebaseAuth.currentUser?.uid;

    if (uid) {
      //@ts-ignore
      updateDoc(getCharacterAssetDoc(uid, characterId), {
        assetOrder: arrayUnion(asset.id),
        [`assets.${asset.id}`]: asset,
      })
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          reject("Error adding asset");
        });
    } else {
      reject("No user found");
    }
  });
}
