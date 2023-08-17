import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToCurrentCharacterAssets() {
  const currentCharacterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId
  );
  const subscribe = useStore(
    (store) => store.characters.currentCharacter.assets.subscribe
  );

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (currentCharacterId) {
      unsubscribe = subscribe(currentCharacterId);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [currentCharacterId, subscribe]);
}
