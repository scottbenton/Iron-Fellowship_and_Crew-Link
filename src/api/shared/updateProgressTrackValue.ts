import { useUpdateCharacterSheetCampaignProgressTrackValue } from "api/campaign/tracks/updateCampaignProgressTrackValue";
import { useUpdateCharacterSheetCharacterProgressTrackValue } from "api/characters/tracks/updateCharacterProgressTrackValue";
import { TRACK_TYPES } from "types/Track.type";

export function useCharacterSheetUpdateProgressTrackValue() {
  const { updateCampaignProgressTrackValue } =
    useUpdateCharacterSheetCampaignProgressTrackValue();
  const { updateCharacterProgressTrackValue } =
    useUpdateCharacterSheetCharacterProgressTrackValue();

  return (params: {
    type: TRACK_TYPES;
    trackId: string;
    value: number;
    isCampaign: boolean;
  }) => {
    const { isCampaign, ...rest } = params;

    return isCampaign
      ? updateCampaignProgressTrackValue(rest)
      : updateCharacterProgressTrackValue(rest);
  };
}
