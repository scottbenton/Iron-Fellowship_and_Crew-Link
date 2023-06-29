import { onSnapshot, query, Unsubscribe } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getErrorMessage } from "../../functions/getErrorMessage";
import { useAuth } from "../../providers/AuthProvider";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useCharacterStore } from "../../stores/character.store";
import { CharacterDocument } from "../../types/Character.type";
import { getCharacterDoc, getUsersCharacterCollection } from "./_getRef";

export function listenToCharacter(
  uid: string | undefined,
  characterId: string | undefined,
  onCharacter: (character: CharacterDocument) => void,
  onError: (error: any) => void
) {
  if (!uid) {
    throw new Error("User Id not provided");
    return;
  }
  if (!characterId) {
    throw new Error("Character Id not provided");
    return;
  }
  return onSnapshot(
    getCharacterDoc(uid, characterId),
    (snapshot) => {
      const character = snapshot.data();
      if (character) {
        onCharacter(character);
      } else {
        onError("No character found");
      }
    },
    (error) => onError(error)
  );
}

export function useListenToCharacter(
  uid: string | undefined,
  characterId: string | undefined
) {
  const { error } = useSnackbar();

  const [character, setCharacter] = useState<CharacterDocument>();

  useEffect(() => {
    const unsubscribe = listenToCharacter(
      uid,
      characterId,
      (doc) => setCharacter(doc),
      (err) => {
        console.error(err);
        const errorMessage = getErrorMessage(error, "Failed to load character");
        error(errorMessage);
      }
    );

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid]);

  return character;
}
