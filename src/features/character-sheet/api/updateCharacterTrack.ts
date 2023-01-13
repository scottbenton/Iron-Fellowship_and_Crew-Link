import { updateDoc } from "firebase/firestore";
import { firebaseAuth } from "../../../config/firebase.config";
import { getCharacterDoc } from "../../../lib/firebase.lib";

export type TrackKeys = "health" | "spirit" | "supply" | "momentum";

export function updateCharacterTrack(
  characterId: string,
  trackKey: TrackKeys,
  newValue: number
) {
  return new Promise((resolve, reject) => {
    const uid = firebaseAuth.currentUser?.uid;

    if (uid) {
      updateDoc(getCharacterDoc(uid, characterId), {
        [trackKey]: newValue,
      })
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          reject("Failed to update " + trackKey);
        });
    } else {
      reject("No user found.");
    }
  });
}
