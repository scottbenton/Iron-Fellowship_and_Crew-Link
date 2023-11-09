import { useStore } from "stores/store";

export function useWorldPermissions() {
  const isOnCharacterSheet = useStore(
    (store) => !!store.characters.currentCharacter.currentCharacter
  );
  const isSinglePlayer = useStore((store) =>
    store.characters.currentCharacter.currentCharacter
      ? !store.characters.currentCharacter.currentCharacter.campaignId
      : false
  );
  const isGM = useStore((store) =>
    store.campaigns.currentCampaign.currentCampaign?.gmIds?.includes(
      store.auth.uid
    )
  );
  const isWorldOwner = useStore((store) =>
    store.worlds.currentWorld.currentWorld?.ownerIds.includes(store.auth.uid)
  );

  const showGMTips =
    !isSinglePlayer && (isGM || (isWorldOwner && !isOnCharacterSheet));
  const showGMFields =
    isSinglePlayer || isGM || (isWorldOwner && !isOnCharacterSheet);

  return { showGMFields, showGMTips, isSinglePlayer };
}
