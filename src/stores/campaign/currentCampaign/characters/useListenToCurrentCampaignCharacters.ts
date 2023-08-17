import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToCurrentCampaignCharacters() {
  const currentCampaignCharacters = useStore(
    (store) =>
      store.campaigns.currentCampaign.currentCampaign?.characters.map(
        (character) => character.characterId
      ) ?? []
  );

  const listenToCampaignCharacters = useStore(
    (store) =>
      store.campaigns.currentCampaign.characters.listenToCampaignCharacters
  );

  useEffect(() => {
    const unsubscribe = listenToCampaignCharacters(currentCampaignCharacters);
    return () => {
      unsubscribe();
    };
  }, [currentCampaignCharacters, listenToCampaignCharacters]);
}
