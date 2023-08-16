import { listenToCharacter } from "api-calls/character/listenToCharacter";
import { Unsubscribe } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CharacterDocument } from "types/Character.type";

export function useListenToCharacter() {
  const { characterId } = useParams();
  const [character, setCharacter] = useState<CharacterDocument>();

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (characterId) {
      unsubscribe = listenToCharacter(
        characterId,
        (character) => setCharacter(character),
        (error) => console.error(error)
      );
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [characterId]);

  return { characterId, character };
}
