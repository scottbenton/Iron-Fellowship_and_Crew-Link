import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToCampaignTracks() {
  const campaignId = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaignId
  );
  const subscribe = useStore(
    (store) => store.campaigns.currentCampaign.tracks.subscribe
  );

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (campaignId) {
      unsubscribe = subscribe(campaignId);
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [campaignId, subscribe]);
}
