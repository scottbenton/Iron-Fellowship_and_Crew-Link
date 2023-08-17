import { Unsubscribe } from "firebase/firestore";
import { StoredTrack, TRACK_TYPES, TrackWithId } from "types/Track.type";

export interface CharacterTracksSliceData {
  trackMap: { [key in TRACK_TYPES]?: TrackWithId[] };
  error?: string;
  loading: boolean;
}

export interface CharacterTracksSliceActions {
  subscribe: (characterId: string) => Unsubscribe;

  addTrack: (type: TRACK_TYPES, track: StoredTrack) => Promise<void>;
  updateTrack: (
    type: TRACK_TYPES,
    trackId: string,
    track: StoredTrack
  ) => Promise<void>;
  updateTrackValue: (
    type: TRACK_TYPES,
    trackId: string,
    value: number
  ) => Promise<void>;
  removeTrack: (type: TRACK_TYPES, trackId: string) => Promise<void>;

  resetStore: () => void;
}

export type CharacterTracksSlice = CharacterTracksSliceData &
  CharacterTracksSliceActions;
