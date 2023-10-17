import { Unsubscribe } from "firebase/firestore";
import { TRACK_STATUS, TRACK_TYPES, Track } from "types/Track.type";

export interface CharacterTracksSliceData {
  trackMap: {
    [TRACK_TYPES.FRAY]: { [trackId: string]: Track };
    [TRACK_TYPES.JOURNEY]: { [trackId: string]: Track };
    [TRACK_TYPES.VOW]: { [trackId: string]: Track };
  };
  error?: string;
  loading: boolean;
}

export interface CharacterTracksSliceActions {
  subscribe: (characterId: string, status?: TRACK_STATUS) => Unsubscribe;

  addTrack: (track: Track) => Promise<void>;
  updateTrack: (trackId: string, track: Partial<Track>) => Promise<void>;

  resetStore: () => void;
}

export type CharacterTracksSlice = CharacterTracksSliceData &
  CharacterTracksSliceActions;
