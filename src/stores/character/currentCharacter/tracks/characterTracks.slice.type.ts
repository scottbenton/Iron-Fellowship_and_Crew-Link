import { Unsubscribe } from "firebase/firestore";
import {
  Clock,
  ProgressTrack,
  TrackStatus,
  TrackTypes,
  Track,
  SceneChallenge,
} from "types/Track.type";

export interface CharacterTracksSliceData {
  loadCompletedTracks: boolean;
  trackMap: Record<
    TrackStatus,
    {
      [TrackTypes.Fray]: Record<string, ProgressTrack>;
      [TrackTypes.Journey]: Record<string, ProgressTrack>;
      [TrackTypes.Vow]: Record<string, ProgressTrack>;
      [TrackTypes.DelveSite]: Record<string, ProgressTrack>;
      [TrackTypes.SceneChallenge]: Record<string, SceneChallenge>;
      [TrackTypes.Clock]: Record<string, Clock>;
    }
  >;
  error?: string;
  loading: boolean;
}

export interface CharacterTracksSliceActions {
  subscribe: (characterId: string, status?: TrackStatus) => Unsubscribe;

  addTrack: (track: Track) => Promise<void>;
  updateTrack: (trackId: string, track: Partial<Track>) => Promise<void>;
  deleteTrack: (trackId: string) => Promise<void>;

  setLoadCompletedTracks: () => void;
  resetStore: () => void;
}

export type CharacterTracksSlice = CharacterTracksSliceData &
  CharacterTracksSliceActions;
