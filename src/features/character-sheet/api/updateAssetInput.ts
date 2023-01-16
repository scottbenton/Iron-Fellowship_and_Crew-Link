import { updateDoc } from "firebase/firestore";
import { firebaseAuth } from "../../../config/firebase.config";
import { getCharacterAssetDoc } from "../../../lib/firebase.lib";

export function updateAssetInput(
  characterId: string,
  assetId: string,
  label: string,
  value: string
) {
  return new Promise<boolean>((resolve, reject) => {
    const uid = firebaseAuth.currentUser?.uid;

    if (uid) {
      //@ts-ignore
      updateDoc(getCharacterAssetDoc(uid, characterId), {
        [`assets.${assetId}.inputs.${label}`]: value,
      })
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          reject("Error updating asset label");
        });
    } else {
      reject("No user found");
    }
  });
}
