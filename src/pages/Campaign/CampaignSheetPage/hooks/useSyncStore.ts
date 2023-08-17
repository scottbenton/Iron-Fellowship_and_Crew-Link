import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useListenToCampaignTracks } from "stores/campaign/currentCampaign/tracks/useListenToCampaignTracks";
import { useListenToCurrentCampaignCharacters } from "stores/campaign/currentCampaign/characters/useListenToCurrentCampaignCharacters";
import { useStore } from "stores/store";

export function useSyncStore() {
  const { campaignId } = useParams();

  const setCampaignId = useStore(
    (store) => store.campaigns.currentCampaign.setCurrentCampaignId
  );

  useEffect(() => {
    setCampaignId(campaignId);
    return () => {
      setCampaignId(undefined);
    };
  }, [setCampaignId, campaignId]);

  useListenToCurrentCampaignCharacters();
  useListenToCampaignTracks();
}
