import { onSnapshot } from "firebase/firestore";
import { SettingsDoc } from "types/Settings.type";
import { getCampaignSettingsDoc, getCharacterSettingsDoc } from "./_getRef";

export function listenToSettings(
  campaignId: string | undefined,
  characterId: string | undefined,
  onSettings: (settings: SettingsDoc) => void,
  onError: (error: any) => void
) {
  if (!campaignId && !characterId) {
    onError("Either campaign or character ID must be defined.");
    return () => {};
  }
  return onSnapshot(
    campaignId
      ? getCampaignSettingsDoc(campaignId)
      : getCharacterSettingsDoc(characterId as string),
    (snapshot) => {
      onSettings({
        hiddenCustomMoveIds: [],
        hiddenCustomOraclesIds: [],
        customStats: [],
        customTracks: {},
        ...snapshot.data(),
      });
    },
    (error) => onError(error)
  );
}
