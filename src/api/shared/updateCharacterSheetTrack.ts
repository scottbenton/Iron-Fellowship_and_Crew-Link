import { useUpdateCampaignSupply } from "api/campaign/updateCampaignSupply";
import { useUpdateCharacterTrack } from "api/characters/updateCharacterTrack";
import {
  TRACK_KEYS,
  useCharacterSheetStore,
} from "features/character-sheet/characterSheet.store";
import { useAuth } from "providers/AuthProvider";

export function useUpdateCharacterSheetTrack() {
  const characterId = useCharacterSheetStore((store) => store.characterId);
  const campaignId = useCharacterSheetStore((store) => store.campaignId);
  const uid = useAuth().user?.uid;
  const { updateCampaignSupply } = useUpdateCampaignSupply();
  const { updateCharacterTrack } = useUpdateCharacterTrack();

  const updateTrack = (params: { trackKey: TRACK_KEYS; value: number }) => {
    const { trackKey, value } = params;

    if (trackKey === "supply" && campaignId) {
      return updateCampaignSupply({ campaignId, supply: value });
    }
    return updateCharacterTrack({ uid, characterId, trackKey, value });
  };

  return { updateTrack };
}
