import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToSettings() {
  const uid = useStore((store) => store.auth.user?.uid);
  const campaignGMIds = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaign?.gmIds
  );
  const subscribe = useStore((store) => store.settings.subscribe);
  const subscribeToSettings = useStore(
    (store) => store.settings.subscribeToSettings
  );

  const campaignId = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaignId
  );
  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId
  );

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (campaignId) {
      unsubscribe = subscribe(campaignGMIds ?? []);
    } else if (uid) {
      unsubscribe = subscribe([uid]);
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [campaignGMIds, campaignId, uid]);

  useEffect(() => {
    const unsubscribe = subscribeToSettings({
      characterId,
      campaignId,
    });
    return () => {
      unsubscribe();
    };
  }, [subscribeToSettings, campaignId, characterId]);
}
