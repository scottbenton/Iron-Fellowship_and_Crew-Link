import { useStore } from "stores/store";

export function useWorldPermissions() {
  const isOnCharacterSheet = useStore(
    (store) => !!store.characters.currentCharacter.currentCharacter
  );
  const isSingleplayer = useStore((store) =>
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
    !isSingleplayer && (isGM || (isWorldOwner && !isOnCharacterSheet));
  const showGMFields =
    isSingleplayer || isGM || (isWorldOwner && !isOnCharacterSheet);

  return { showGMFields, showGMTips, isSingleplayer };
}
