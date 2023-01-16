import { updateDoc } from "firebase/firestore";
import { firebaseAuth } from "../../../config/firebase.config";
import { getCharacterAssetDoc } from "../../../lib/firebase.lib";

export function updateAssetCheckbox(
  characterId: string,
  assetId: string,
  assetAbilityIndex: number,
  isChecked: boolean
) {
  return new Promise<boolean>((resolve, reject) => {
    const uid = firebaseAuth.currentUser?.uid;
    if (uid) {
      //@ts-ignore
      updateDoc(getCharacterAssetDoc(uid, characterId), {
        [`assets.${assetId}.enabledAbilities.${assetAbilityIndex}`]: isChecked,
      })
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          reject("Error updating asset ability");
        });
    } else {
      reject("No user found");
    }
  });
}
