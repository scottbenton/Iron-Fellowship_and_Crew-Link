import { useCharacterSheetAddCampaignProgressTrack } from "api/campaign/tracks/addCampaignProgressTrack";
import { useCharacterSheetAddCharacterProgressTrack } from "api/characters/tracks/addCharacterProgressTrack";
import { StoredTrack, TRACK_TYPES } from "types/Track.type";

export function useCharacterSheetAddProgressTrack() {
  const { addCampaignProgressTrack } =
    useCharacterSheetAddCampaignProgressTrack();
  const { addCharacterProgressTrack } =
    useCharacterSheetAddCharacterProgressTrack();

  return (params: {
    type: TRACK_TYPES;
    track: StoredTrack;
    isCampaign: boolean;
  }) => {
    const { isCampaign, ...rest } = params;

    return isCampaign
      ? addCampaignProgressTrack(rest)
      : addCharacterProgressTrack(rest);
  };
}
