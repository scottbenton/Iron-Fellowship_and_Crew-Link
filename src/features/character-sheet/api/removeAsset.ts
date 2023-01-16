import { arrayRemove, deleteField, updateDoc } from "firebase/firestore";
import { firebaseAuth } from "../../../config/firebase.config";
import { getCharacterAssetDoc } from "../../../lib/firebase.lib";

export function removeAsset(characterId: string, assetId: string) {
  return new Promise<boolean>((resolve, reject) => {
    const uid = firebaseAuth.currentUser?.uid;

    if (uid) {
      //@ts-ignore
      updateDoc(getCharacterAssetDoc(uid, characterId), {
        assetOrder: arrayRemove(assetId),
        [`assets.${assetId}`]: deleteField(),
      })
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          reject("Error removing asset");
        });
    } else {
      reject("No user found");
    }
  });
}
