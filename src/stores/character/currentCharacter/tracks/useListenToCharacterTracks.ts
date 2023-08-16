import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToCharacterTracks() {
  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId
  );
  const subscribe = useStore(
    (store) => store.characters.currentCharacter.tracks.subscribe
  );

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (characterId) {
      unsubscribe = subscribe(characterId);
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [characterId, subscribe]);
}
