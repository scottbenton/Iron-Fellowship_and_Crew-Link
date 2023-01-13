import { updateDoc } from "firebase/firestore";
import { firebaseAuth } from "../../../config/firebase.config";
import { getCharacterDoc } from "../../../lib/firebase.lib";
import { STATS } from "../../../types/stats.enum";

export function updateStat(characterId: string, stat: STATS, newValue: number) {
  return new Promise((resolve, reject) => {
    const uid = firebaseAuth.currentUser?.uid;

    const statKey = `stats.${stat}`;

    if (uid) {
      updateDoc(getCharacterDoc(uid, characterId), {
        [statKey]: newValue,
      })
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          reject("Failed to update " + stat);
        });
    } else {
      reject("No user found.");
    }
  });
}
