import { useStore } from "stores/store";

export function CustomStats() {
  const isInCampaign = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.campaignId
  );

  return <>Custom Stats</>;
}
