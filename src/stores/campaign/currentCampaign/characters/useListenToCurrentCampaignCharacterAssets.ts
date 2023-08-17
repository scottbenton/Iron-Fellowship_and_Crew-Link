import { useEffect } from "react";
import { useStore } from "stores/store";

export function useListenToCurrentCampaignCharacterAssets() {
  const currentCampaignCharacters = useStore(
    (store) =>
      store.campaigns.currentCampaign.currentCampaign?.characters.map(
        (character) => character.characterId
      ) ?? []
  );

  const listenToCampaignCharacterAssets = useStore(
    (store) =>
      store.campaigns.currentCampaign.characters.listenToCampaignCharacterAssets
  );

  useEffect(() => {
    const unsubscribe = listenToCampaignCharacterAssets(
      currentCampaignCharacters
    );
    return () => {
      unsubscribe();
    };
  }, [currentCampaignCharacters, listenToCampaignCharacterAssets]);
}
