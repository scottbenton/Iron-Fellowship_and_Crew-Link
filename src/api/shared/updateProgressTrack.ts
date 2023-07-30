import { useUpdateCharacterSheetCampaignProgressTrack } from "api/campaign/tracks/updateCampaignProgressTrack";
import { useUpdateCharacterSheetCharacterProgressTrack } from "api/characters/tracks/updateCharacterProgressTrack";
import { StoredTrack, TRACK_TYPES } from "types/Track.type";

export function useCharacterSheetUpdateProgressTrack() {
  const { updateCampaignProgressTrack } =
    useUpdateCharacterSheetCampaignProgressTrack();
  const { updateCharacterProgressTrack } =
    useUpdateCharacterSheetCharacterProgressTrack();

  return (params: {
    type: TRACK_TYPES;
    trackId: string;
    track: StoredTrack;
    isCampaign: boolean;
  }) => {
    const { isCampaign, ...rest } = params;

    return isCampaign
      ? updateCampaignProgressTrack(rest)
      : updateCharacterProgressTrack(rest);
  };
}
