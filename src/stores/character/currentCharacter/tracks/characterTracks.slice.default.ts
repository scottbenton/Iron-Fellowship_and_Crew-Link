import { TRACK_TYPES } from "types/Track.type";
import { CharacterTracksSliceData } from "./characterTracks.slice.type";

export const defaultCharacterTracksSlice: CharacterTracksSliceData = {
  trackMap: {
    [TRACK_TYPES.FRAY]: {},
    [TRACK_TYPES.JOURNEY]: {},
    [TRACK_TYPES.VOW]: {},
  },
  error: "",
  loading: false,
};
