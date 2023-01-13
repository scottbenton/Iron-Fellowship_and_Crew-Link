import { deleteDoc } from "firebase/firestore";
import { firebaseAuth } from "../config/firebase.config";
import { getCharacterAssetDoc, getCharacterDoc } from "../lib/firebase.lib";

export function deleteCharacter(characterId: string) {
  return new Promise((resolve, reject) => {
    const uid = firebaseAuth.currentUser?.uid;
    if (uid) {
      // delete subcollections by removing documents
      deleteDoc(getCharacterAssetDoc(uid, characterId)).catch((e) =>
        console.error(e)
      );
      // delete main character
      deleteDoc(getCharacterDoc(uid, characterId))
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          console.error(err);
          reject("Failed to delete character");
        });
    } else {
      reject("You are not logged in");
    }
  });
}
