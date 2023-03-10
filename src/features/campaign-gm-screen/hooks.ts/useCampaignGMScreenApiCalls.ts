import { useCampaignGMScreenListenToCampaignNotes } from "api/campaign/notes/listenToCampaignNotes";
import { useCampaignGMScreenListenToCampaignCustomMoves } from "api/campaign/customMoves/listenToCampaignCustomMoves";
import { useCampaignGMScreenListenToCampaignProgressTracks } from "api/campaign/tracks/listenToCampaignProgressTracks";
import { useCampaignGMScreenListenToCampaignAssets } from "api/characters/assets/listenToCampaignCharactersAssets";
import { useCampaignGMScreenListenToCampaignCharacters } from "api/characters/listenToCampaignCharacters";
import { useEffect } from "react";
import { useCampaignStore } from "stores/campaigns.store";
import { useCampaignGMScreenStore } from "../campaignGMScreen.store";

export function useCampaignGMScreenApiCalls(campaignId?: string) {
  const campaign = useCampaignStore(
    (store) => store.campaigns[campaignId ?? ""]
  );

  const resetStoreState = useCampaignGMScreenStore((store) => store.resetState);
  const setCampaign = useCampaignGMScreenStore((store) => store.setCampaign);

  useCampaignGMScreenListenToCampaignCharacters();
  useCampaignGMScreenListenToCampaignAssets();
  useCampaignGMScreenListenToCampaignProgressTracks();
  useCampaignGMScreenListenToCampaignNotes();
  useCampaignGMScreenListenToCampaignCustomMoves();

  useEffect(() => {
    return () => {
      resetStoreState();
    };
  }, [campaignId]);

  useEffect(() => {
    if (campaignId) {
      setCampaign(campaignId, campaign);
    }
  }, [campaignId, campaign]);
}
