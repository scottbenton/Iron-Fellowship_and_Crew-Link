import { useCampaignGMScreenListenToCampaignNotes } from "api/campaign/notes/listenToCampaignNotes";
import { useCampaignGMScreenListenToCampaignProgressTracks } from "api/campaign/tracks/listenToCampaignProgressTracks";
import { useCampaignGMScreenListenToCampaignAssets } from "api/characters/assets/listenToCampaignCharactersAssets";
import { useCampaignGMScreenListenToCampaignCharacters } from "api/characters/listenToCampaignCharacters";
import { useEffect } from "react";
import { useCampaignStore } from "stores/campaigns.store";
import { useCampaignGMScreenStore } from "../campaignGMScreen.store";
import { useCampaignGMScreenListenToCustomOracles } from "api/user/custom-oracles/listenToCustomOracles";
import { useCampaignGMScreenListenToCustomMoves } from "api/user/custom-moves/listenToCustomMoves";
import { useCampaignGMScreenListenToCampaignSettings } from "api/campaign/settings/listenToCampaignSettings";
import { useCampaignGMScreenListenToLocations } from "api/worlds/locations/listenToLocations";
import { useCampaignGMScreenListenToNPCs } from "api/worlds/npcs/listenToNPCs";
import { useCampaignGMScreenListenToLore } from "api/worlds/lore/listenToLore";

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
  useCampaignGMScreenListenToCustomMoves();
  useCampaignGMScreenListenToCustomOracles();
  useCampaignGMScreenListenToCampaignSettings();
  useCampaignGMScreenListenToLocations();
  useCampaignGMScreenListenToNPCs();
  useCampaignGMScreenListenToLore();

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
