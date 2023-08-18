import { Timestamp, Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToNewLogs() {
  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId
  );
  const campaignId = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaignId
  );
  const latestLog = useStore((store) => store.gameLog.newestLogDate);

  const subscribe = useStore((store) => store.gameLog.subscribe);

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (latestLog) {
      unsubscribe = subscribe({
        campaignId,
        characterId,
        latestLoadedDate: latestLog,
      });
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [characterId, campaignId, latestLog, subscribe]);
}
