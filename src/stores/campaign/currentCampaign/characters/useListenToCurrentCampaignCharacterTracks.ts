import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToCurrentCampaignCharacterTracks() {
  const currentCampaignCharacters = useStore(
    (store) =>
      store.campaigns.currentCampaign.currentCampaign?.characters.map(
        (character) => character.characterId
      ) ?? []
  );

  const listenToCampaignCharacterTracks = useStore(
    (store) =>
      store.campaigns.currentCampaign.characters.listenToCampaignCharacterTracks
  );

  useEffect(() => {
    const unsubscribe = listenToCampaignCharacterTracks(
      currentCampaignCharacters
    );
    return () => {
      unsubscribe();
    };
  }, [currentCampaignCharacters, listenToCampaignCharacterTracks]);
}
