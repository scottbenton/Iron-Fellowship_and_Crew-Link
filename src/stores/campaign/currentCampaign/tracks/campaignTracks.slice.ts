import { CreateSliceType } from "stores/store.type";
import { CampaignTracksSlice } from "./campaignTracks.slice.type";
import { defaultCampaignTracksSlice } from "./campaignTracks.slice.default";
import { listenToProgressTracks } from "api-calls/tracks/listenToProgressTracks";
import { StoredTrack, TRACK_TYPES, Track } from "types/Track.type";
import { addProgressTrack } from "api-calls/tracks/addProgressTrack";
import { updateProgressTrack } from "api-calls/tracks/updateProgressTrack";
import { removeProgressTrack } from "api-calls/tracks/removeProgressTrack";

export const createCampaignTracksSlice: CreateSliceType<CampaignTracksSlice> = (
  set,
  getState
) => ({
  ...defaultCampaignTracksSlice,

  subscribe: (campaignId) => {
    const unsubscribe = listenToProgressTracks(
      campaignId,
      undefined,
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
