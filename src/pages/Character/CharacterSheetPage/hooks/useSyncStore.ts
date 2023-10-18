import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useListenToCurrentCampaignCharacters } from "stores/campaign/currentCampaign/characters/useListenToCurrentCampaignCharacters";
import { useListenToCampaignTracks } from "stores/campaign/currentCampaign/tracks/useListenToCampaignTracks";
import { useListenToCurrentCharacterAssets } from "stores/character/currentCharacter/assets/useListenToCurrentCharacterAssets";
import { useListenToCharacterTracks } from "stores/character/currentCharacter/tracks/useListenToCharacterTracks";
import { useListenToSettings } from "stores/settings/useListenToSettings";
import { useListenToNewLogs } from "stores/gameLog/useListenToNewLogs";
import { useListenToNotes } from "stores/notes/useListenToNotes";
import { useStore } from "stores/store";
import { useListenToLocations } from "stores/world/currentWorld/locations/useListenToLocations";
import { useListenToLoreDocuments } from "stores/world/currentWorld/lore/useListenToLoreDocuments";
import { useListenToNPCs } from "stores/world/currentWorld/npcs/useListenToNPCs";
import { useListenToSectors } from "stores/world/currentWorld/sector/useListenToSectors";
import { useListenToSectorLocations } from "stores/world/currentWorld/sector/sectorLocations/useListenToSectorLocations";
import { useListenToSharedAssets } from "stores/campaign/currentCampaign/sharedAssets/useListenToSharedAssets";

export function useSyncStore() {
  const { characterId } = useParams();

  const character = useStore(
    (store) => store.characters.currentCharacter.currentCharacter
  );
  const resetStore = useStore(
    (store) => store.characters.currentCharacter.resetStore
  );

  const campaignId = character?.campaignId;
  const worldId = character?.worldId;

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
    setCurrentCampaignId(campaignId);
    return () => {
      setCurrentCampaignId(campaignId);
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
  useListenToSectors();
  useListenToSectorLocations();

  useListenToNewLogs();
  useListenToCurrentCampaignCharacters();
}
