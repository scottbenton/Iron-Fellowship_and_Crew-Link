import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToCampaigns() {
  const subscribe = useStore((store) => store.campaigns.subscribe);
  const uid = useStore((store) => store.auth.user?.uid);

  useEffect(() => {
    const unsubscribe = subscribe(uid);

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid, subscribe]);
}
