import { Unsubscribe } from "firebase/firestore";
import { useEffect } from "react";
import { useStore } from "stores/store";
import { TRACK_STATUS } from "types/Track.type";

export function useListenToCampaignTracks() {
  const campaignId = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaignId
  );
  const loadCompletedTracks = useStore(
    (store) => store.campaigns.currentCampaign.tracks.loadCompletedTracks
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
  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (campaignId && loadCompletedTracks) {
      unsubscribe = subscribe(campaignId, TRACK_STATUS.COMPLETED);
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [campaignId, subscribe, loadCompletedTracks]);
}
