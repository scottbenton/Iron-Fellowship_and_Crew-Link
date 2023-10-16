import { Unsubscribe } from "firebase/firestore";
import { TRACK_TYPES, Track } from "types/Track.type";

export interface CampaignTracksSliceData {
  trackMap: {
    [TRACK_TYPES.FRAY]: { [trackId: string]: Track };
    [TRACK_TYPES.JOURNEY]: { [trackId: string]: Track };
    [TRACK_TYPES.VOW]: { [trackId: string]: Track };
  };
  error?: string;
  loading: boolean;
}

export interface CampaignTracksSliceActions {
  subscribe: (campaignId: string) => Unsubscribe;

  addTrack: (track: Track) => Promise<void>;
  updateTrack: (trackId: string, track: Partial<Track>) => Promise<void>;

  updateCharacterTrack: (
    characterId: string,
    trackId: string,
    track: Partial<Track>
  ) => Promise<void>;

  resetStore: () => void;
}

export type CampaignTracksSlice = CampaignTracksSliceData &
  CampaignTracksSliceActions;
