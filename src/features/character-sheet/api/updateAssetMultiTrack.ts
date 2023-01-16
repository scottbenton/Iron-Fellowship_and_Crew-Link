import { updateDoc } from "firebase/firestore";
import { firebaseAuth } from "../../../config/firebase.config";
import { getCharacterAssetDoc } from "../../../lib/firebase.lib";

export function updateAssetMultiTrack(
  characterId: string,
  assetId: string,
  trackValue: string
) {
  return new Promise<boolean>((resolve, reject) => {
    const uid = firebaseAuth.currentUser?.uid;

    if (uid) {
      //@ts-ignore
      updateDoc(getCharacterAssetDoc(uid, characterId), {
        [`assets.${assetId}.multiFieldTrackValue`]: trackValue,
      })
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          reject("Error updating asset value");
        });
    } else {
      reject("No user found");
    }
  });
}
