import { TRACK_TYPES } from "types/Track.type";
import { CampaignTracksSliceData } from "./campaignTracks.slice.type";

export const defaultCampaignTracksSlice: CampaignTracksSliceData = {
  trackMap: {
    [TRACK_TYPES.FRAY]: {},
    [TRACK_TYPES.JOURNEY]: {},
    [TRACK_TYPES.VOW]: {},
    [TRACK_TYPES.CLOCK]: {},
  },
  error: "",
  loading: false,
};
