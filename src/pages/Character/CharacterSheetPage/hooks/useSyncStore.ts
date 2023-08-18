import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useListenToCurrentCampaignCharacters } from "stores/campaign/currentCampaign/characters/useListenToCurrentCampaignCharacters";
import { useListenToCampaignTracks } from "stores/campaign/currentCampaign/tracks/useListenToCampaignTracks";
import { useListenToCurrentCharacterAssets } from "stores/character/currentCharacter/assets/useListenToCurrentCharacterAssets";
import { useListenToCharacterTracks } from "stores/character/currentCharacter/tracks/useListenToCharacterTracks";
import { useListenToCustomMovesAndOracles } from "stores/customMovesAndOracles/useListenToCustomMovesAndOracles";
import { useListenToNewLogs } from "stores/gameLog/useListenToNewLogs";
import { useListenToNotes } from "stores/notes/useListenToNotes";
import { useStore } from "stores/store";
import { useListenToLocations } from "stores/world/currentWorld/locations/useListenToLocations";
import { useListenToLoreDocuments } from "stores/world/currentWorld/lore/useListenToLoreDocuments";
import { useListenToNPCs } from "stores/world/currentWorld/npcs/useListenToNPCs";

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

  useListenToCustomMovesAndOracles();
  useListenToCurrentCharacterAssets();

  useListenToCampaignTracks();
  useListenToCharacterTracks();

  useListenToNotes();

  useListenToLocations();
  useListenToNPCs();
  useListenToLoreDocuments();

  useListenToNewLogs();
  useListenToCurrentCampaignCharacters();
}
