import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToCharacters() {
  const subscribe = useStore((store) => store.characters.subscribe);
  const uid = useStore((store) => store.auth.user?.uid);

  useEffect(() => {
    const unsubscribe = subscribe(uid);

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid, subscribe]);
}
