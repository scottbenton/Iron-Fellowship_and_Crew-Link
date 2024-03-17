import { CreateSliceType } from "stores/store.type";
import { CampaignTracksSlice } from "./campaignTracks.slice.type";
import { defaultCampaignTracksSlice } from "./campaignTracks.slice.default";
import { listenToProgressTracks } from "api-calls/tracks/listenToProgressTracks";
import {
  Clock,
  ProgressTrack,
  TRACK_STATUS,
  TRACK_TYPES,
} from "types/Track.type";
import { addProgressTrack } from "api-calls/tracks/addProgressTrack";
import { updateProgressTrack } from "api-calls/tracks/updateProgressTrack";

export const createCampaignTracksSlice: CreateSliceType<CampaignTracksSlice> = (
  set,
  getState
) => ({
  ...defaultCampaignTracksSlice,

  subscribe: (campaignId, status = TRACK_STATUS.ACTIVE) => {
    const unsubscribe = listenToProgressTracks(
      campaignId,
      undefined,
      status,
      (tracks) => {
        set((store) => {
          Object.keys(tracks).forEach((trackId) => {
            const track = tracks[trackId];
            switch (track.type) {
              case TRACK_TYPES.FRAY:
                store.campaigns.currentCampaign.tracks.trackMap[status][
                  TRACK_TYPES.FRAY
                ][trackId] = track as ProgressTrack;
                break;
              case TRACK_TYPES.JOURNEY:
                store.campaigns.currentCampaign.tracks.trackMap[status][
                  TRACK_TYPES.JOURNEY
                ][trackId] = track as ProgressTrack;
                break;
              case TRACK_TYPES.VOW:
                store.campaigns.currentCampaign.tracks.trackMap[status][
                  TRACK_TYPES.VOW
                ][trackId] = track as ProgressTrack;
                break;
              case TRACK_TYPES.CLOCK:
                store.campaigns.currentCampaign.tracks.trackMap[status][
                  TRACK_TYPES.CLOCK
                ][trackId] = track as Clock;
                break;
              default:
                break;
            }
          });
        });
      },
      (trackId, type) => {
        set((store) => {
          delete store.campaigns.currentCampaign.tracks.trackMap[status][type][
            trackId
          ];
        });
      },
      (error) => {
        console.error(error);
      }
    );

    if (!unsubscribe) {
      return () => {};
    }
    return unsubscribe;
  },

  addTrack: (track) => {
    const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
    return addProgressTrack({ campaignId, track });
  },
  updateTrack: (trackId, track) => {
    const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
    return updateProgressTrack({ campaignId, trackId, track });
  },

  updateCharacterTrack: (characterId, trackId, track) => {
    return updateProgressTrack({ characterId, trackId, track });
  },

  setLoadCompletedTracks: () => {
    set((store) => {
      store.campaigns.currentCampaign.tracks.loadCompletedTracks = true;
    });
  },

  resetStore: () => {
    set((store) => {
      store.campaigns.currentCampaign.tracks = {
        ...store.campaigns.currentCampaign.tracks,
        ...defaultCampaignTracksSlice,
      };
    });
  },
});
