import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToSharedAssets() {
  const currentCampaignId = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaignId
  );
  const subscribe = useStore(
    (store) => store.campaigns.currentCampaign.assets.subscribe
  );

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (currentCampaignId) {
      unsubscribe = subscribe(currentCampaignId);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [currentCampaignId, subscribe]);
}
