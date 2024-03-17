import { Unsubscribe } from "firebase/firestore";
import {
  Clock,
  ProgressTrack,
  TRACK_STATUS,
  TRACK_TYPES,
  Track,
} from "types/Track.type";

export interface CampaignTracksSliceData {
  loadCompletedTracks: boolean;
  trackMap: Record<
    TRACK_STATUS,
    {
      [TRACK_TYPES.FRAY]: { [trackId: string]: ProgressTrack };
      [TRACK_TYPES.JOURNEY]: { [trackId: string]: ProgressTrack };
      [TRACK_TYPES.VOW]: { [trackId: string]: ProgressTrack };
      [TRACK_TYPES.CLOCK]: { [clockId: string]: Clock };
    }
  >;
  error?: string;
  loading: boolean;
}

export interface CampaignTracksSliceActions {
  subscribe: (campaignId: string, status?: TRACK_STATUS) => Unsubscribe;

  addTrack: (track: Track) => Promise<void>;
  updateTrack: (trackId: string, track: Partial<Track>) => Promise<void>;

  updateCharacterTrack: (
    characterId: string,
    trackId: string,
    track: Partial<Track>
  ) => Promise<void>;

  setLoadCompletedTracks: () => void;

  resetStore: () => void;
}

export type CampaignTracksSlice = CampaignTracksSliceData &
  CampaignTracksSliceActions;
