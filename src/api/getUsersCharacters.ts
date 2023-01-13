import { onSnapshot, query } from "firebase/firestore";
import { firebaseAuth } from "../config/firebase.config";
import { getUsersCharacterCollection } from "../lib/firebase.lib";
import { CharacterDocument } from "../types/Character.type";

export function getUsersCharacters(
  onCharacters: (characters: { [id: string]: CharacterDocument }) => void,
  onError: (errorMessage?: string) => void
) {
  const userId = firebaseAuth.currentUser?.uid;

  if (!userId) {
  } else {
    const characterQuery = query(getUsersCharacterCollection(userId));

    const unsubscribe = onSnapshot(
      characterQuery,
      (querySnapshot) => {
        const characters: { [id: string]: CharacterDocument } = {};
        querySnapshot.forEach((doc) => {
          characters[doc.id] = doc.data();
        });
        onCharacters(characters);
        onError();
      },
      (error) => {
        onError(error.message);
      }
    );

    return unsubscribe;
  }
  return null;
}
