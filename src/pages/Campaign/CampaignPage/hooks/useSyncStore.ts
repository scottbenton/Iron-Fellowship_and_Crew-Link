import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useListenToCampaignTracks } from "stores/campaign/currentCampaign/tracks/useListenToCampaignTracks";
import { useListenToCurrentCampaignCharacters } from "stores/campaign/currentCampaign/characters/useListenToCurrentCampaignCharacters";
import { useStore } from "stores/store";
import { useListenToCurrentCampaignCharacterAssets } from "stores/campaign/currentCampaign/characters/useListenToCurrentCampaignCharacterAssets";
import { useListenToCurrentCampaignCharacterTracks } from "stores/campaign/currentCampaign/characters/useListenToCurrentCampaignCharacterTracks";
import { useListenToSettings } from "stores/settings/useListenToSettings";
import { useListenToNotes } from "stores/notes/useListenToNotes";
import { useListenToLocations } from "stores/world/currentWorld/locations/useListenToLocations";
import { useListenToNPCs } from "stores/world/currentWorld/npcs/useListenToNPCs";
import { useListenToLoreDocuments } from "stores/world/currentWorld/lore/useListenToLoreDocuments";
import { useListenToSharedAssets } from "stores/campaign/currentCampaign/sharedAssets/useListenToSharedAssets";
import { useListenToLogs } from "stores/gameLog/useListenToLogs";
import { useListenToHomebrewContent } from "stores/homebrew/useListenToHomebrewContent";
import { useSyncTheme } from "providers/ThemeProvider/useSyncTheme";

export function useSyncStore() {
  const { campaignId } = useParams();

  const setCampaignId = useStore(
    (store) => store.campaigns.currentCampaign.setCurrentCampaignId
  );
  const expansionIds = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaign?.expansionIds
  );

  useEffect(() => {
    setCampaignId(campaignId);
    return () => {
      setCampaignId(undefined);
    };
  }, [campaignId, setCampaignId]);

  useListenToCurrentCampaignCharacters();
  useListenToCurrentCampaignCharacterAssets();
  useListenToCurrentCampaignCharacterTracks();
  useListenToCampaignTracks();
  useListenToSharedAssets();

  useListenToLocations();
  useListenToNPCs();
  useListenToLoreDocuments();

  useListenToNotes();

  useListenToSettings();
  useListenToLogs();

  useListenToHomebrewContent(expansionIds ?? []);

  useSyncTheme();
}
