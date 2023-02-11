import { useCharacterSheetRemoveCampaignProgressTrack } from "api/campaign/tracks/removeCampaignProgressTrack";
import { useCharacterSheetRemoveCharacterProgressTrack } from "api/characters/tracks/removeCharacterProgressTrack";
import { TRACK_TYPES } from "types/Track.type";

export function useCharacterSheetRemoveProgressTrack() {
  const { removeCampaignProgressTrack } =
    useCharacterSheetRemoveCampaignProgressTrack();
  const { removeCharacterProgressTrack } =
    useCharacterSheetRemoveCharacterProgressTrack();

  return (params: { type: TRACK_TYPES; id: string; isCampaign: boolean }) => {
    const { isCampaign, ...rest } = params;

    return isCampaign
      ? removeCampaignProgressTrack(rest)
      : removeCharacterProgressTrack(rest);
  };
}
