import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useListenToCurrentCampaignCharacters } from "stores/campaign/currentCampaign/characters/useListenToCurrentCampaignCharacters";
import { useListenToCampaignTracks } from "stores/campaign/currentCampaign/tracks/useListenToCampaignTracks";
import { useListenToCurrentCharacterAssets } from "stores/character/currentCharacter/assets/useListenToCurrentCharacterAssets";
import { useListenToCharacterTracks } from "stores/character/currentCharacter/tracks/useListenToCharacterTracks";
import { useListenToSettings } from "stores/settings/useListenToSettings";
import { useListenToLogs } from "stores/gameLog/useListenToLogs";
import { useListenToNotes } from "stores/notes/useListenToNotes";
import { useStore } from "stores/store";
import { useListenToLocations } from "stores/world/currentWorld/locations/useListenToLocations";
import { useListenToLoreDocuments } from "stores/world/currentWorld/lore/useListenToLoreDocuments";
import { useListenToNPCs } from "stores/world/currentWorld/npcs/useListenToNPCs";
import { useListenToSharedAssets } from "stores/campaign/currentCampaign/sharedAssets/useListenToSharedAssets";
import { useListenToHomebrewContent } from "stores/homebrew/useListenToHomebrewContent";
import { useSyncTheme } from "providers/ThemeProvider/useSyncTheme";

export function useSyncStore() {
  const { characterId } = useParams();

  const resetStore = useStore(
    (store) => store.characters.currentCharacter.resetStore
  );

  const campaignId = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.campaignId
  );
  const worldId = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.worldId
  );

  const characterExpansionIds = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.expansionIds
  );
  const campaignExpansionIds = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaign?.expansionIds
  );

  const setCurrentCharacterId = useStore(
    (store) => store.characters.currentCharacter.setCurrentCharacterId
  );
  const setCurrentCampaignId = useStore(
    (store) => store.campaigns.currentCampaign.setCurrentCampaignId
  );
  const setCurrentWorldId = useStore(
    (store) => store.worlds.currentWorld.setCurrentWorldId
  );

  useEffect(() => {
    setCurrentCharacterId(characterId);
    return () => {
      setCurrentCharacterId(undefined);
    };
  }, [setCurrentCharacterId, characterId]);

  useEffect(() => {
    setCurrentCampaignId(campaignId ?? undefined);
    return () => {
      setCurrentCampaignId(undefined);
    };
  }, [campaignId, setCurrentCampaignId]);

  useEffect(() => {
    if (!campaignId) {
      setCurrentWorldId(worldId ?? undefined);
    }
    return () => {
      setCurrentWorldId(undefined);
    };
  }, [campaignId, worldId, setCurrentWorldId]);

  useEffect(() => {
    return () => {
      resetStore();
    };
  }, [resetStore]);

  useListenToSettings();
  useListenToCurrentCharacterAssets();
  useListenToSharedAssets();

  useListenToCampaignTracks();
  useListenToCharacterTracks();

  useListenToNotes();

  useListenToLocations();
  useListenToNPCs();
  useListenToLoreDocuments();

  useListenToLogs();
  useListenToCurrentCampaignCharacters();

  useListenToHomebrewContent(
    (campaignId ? campaignExpansionIds : characterExpansionIds) ?? []
  );

  useSyncTheme();
}
