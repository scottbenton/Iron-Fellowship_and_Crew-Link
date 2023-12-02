import { Unsubscribe } from "firebase/firestore";
import { useEffect, useRef } from "react";
import { useStore } from "stores/store";

export function useListenToLogs() {
  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId
  );
  const campaignId = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaignId
  );
  const totalLogsToLoad = useStore((store) => store.gameLog.totalLogsToLoad);
  const previousUnsubscribe = useRef<Unsubscribe | undefined>(undefined);

  const subscribe = useStore((store) => store.gameLog.subscribe);

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined = undefined;

    if (characterId || campaignId) {
      unsubscribe = subscribe({
        campaignId,
        characterId,
        totalLogsToLoad,
      });
    }
    if (previousUnsubscribe.current) {
      previousUnsubscribe.current();
    }
    if (unsubscribe) {
      previousUnsubscribe.current = unsubscribe;
    }
  }, [characterId, campaignId, totalLogsToLoad, subscribe]);

  useEffect(() => {
    return () => {
      previousUnsubscribe.current && previousUnsubscribe.current();
    };
  }, []);
}
