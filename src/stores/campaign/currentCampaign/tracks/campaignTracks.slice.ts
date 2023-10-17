import { CreateSliceType } from "stores/store.type";
import { CampaignTracksSlice } from "./campaignTracks.slice.type";
import { defaultCampaignTracksSlice } from "./campaignTracks.slice.default";
import { listenToProgressTracks } from "api-calls/tracks/listenToProgressTracks";
import { TRACK_STATUS, TRACK_TYPES } from "types/Track.type";
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
                store.campaigns.currentCampaign.tracks.trackMap[
                  TRACK_TYPES.FRAY
                ][trackId] = track;
                break;
              case TRACK_TYPES.JOURNEY:
                store.campaigns.currentCampaign.tracks.trackMap[
                  TRACK_TYPES.JOURNEY
                ][trackId] = track;
                break;
              case TRACK_TYPES.VOW:
                store.campaigns.currentCampaign.tracks.trackMap[
                  TRACK_TYPES.VOW
                ][trackId] = track;
                break;
              default:
                break;
            }
          });
        });
      },
      (trackId, type) => {
        set((store) => {
          delete store.campaigns.currentCampaign.tracks.trackMap[type][trackId];
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

  resetStore: () => {
    set((store) => {
      store.campaigns.currentCampaign.tracks = {
        ...store.campaigns.currentCampaign.tracks,
        ...defaultCampaignTracksSlice,
      };
    });
  },
});
