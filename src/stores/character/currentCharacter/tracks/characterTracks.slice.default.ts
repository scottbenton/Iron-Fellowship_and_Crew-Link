import { TRACK_STATUS, TRACK_TYPES } from "types/Track.type";
import { CharacterTracksSliceData } from "./characterTracks.slice.type";

export const defaultCharacterTracksSlice: CharacterTracksSliceData = {
  loadCompletedTracks: false,
  trackMap: {
    [TRACK_STATUS.ACTIVE]: {
      [TRACK_TYPES.FRAY]: {},
      [TRACK_TYPES.JOURNEY]: {},
      [TRACK_TYPES.VOW]: {},
      [TRACK_TYPES.CLOCK]: {},
    },
    [TRACK_STATUS.COMPLETED]: {
      [TRACK_TYPES.FRAY]: {},
      [TRACK_TYPES.JOURNEY]: {},
      [TRACK_TYPES.VOW]: {},
      [TRACK_TYPES.CLOCK]: {},
    },
  },
  error: "",
  loading: false,
};
