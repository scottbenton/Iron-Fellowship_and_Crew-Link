import { useUpdateCharacterSheetCampaignProgressTrack } from "api/campaign/tracks/updateCampaignProgressTrack";
import { useUpdateCharacterSheetCharacterProgressTrack } from "api/characters/tracks/updateCharacterProgressTrack";
import { TRACK_TYPES } from "types/Track.type";

export function useCharacterSheetUpdateProgressTrack() {
  const { updateCampaignProgressTrack } =
    useUpdateCharacterSheetCampaignProgressTrack();
  const { updateCharacterProgressTrack } =
    useUpdateCharacterSheetCharacterProgressTrack();

  return (params: {
    type: TRACK_TYPES;
    trackId: string;
    value: number;
    isCampaign: boolean;
  }) => {
    const { isCampaign, ...rest } = params;

    return isCampaign
      ? updateCampaignProgressTrack(rest)
      : updateCharacterProgressTrack(rest);
  };
}
