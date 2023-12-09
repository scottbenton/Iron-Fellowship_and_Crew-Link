import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToHomebrew() {
  const uid = useStore((store) => store.auth.user?.uid);
  const subscribe = useStore((store) => store.homebrew.subscribe);

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined = undefined;

    if (uid) {
      unsubscribe = subscribe(uid);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid, subscribe]);
}
