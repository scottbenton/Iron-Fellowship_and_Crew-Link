import { CreateSliceType } from "stores/store.type";
import { CampaignTracksSlice } from "./campaignTracks.slice.type";
import { defaultCampaignTracksSlice } from "./campaignTracks.slice.default";
import { listenToProgressTracks } from "api-calls/tracks/listenToProgressTracks";
import { StoredTrack, TRACK_TYPES } from "types/Track.type";
import { addProgressTrack } from "api-calls/tracks/addProgressTrack";
import { updateProgressTrack } from "api-calls/tracks/updateProgressTrack";
import { updateProgressTrackValue } from "api-calls/tracks/updateProgressTrackValue";
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
      (vows, journeys, frays) => {
        set((store) => {
          store.campaigns.currentCampaign.tracks.trackMap = {
            [TRACK_TYPES.FRAY]: frays,
            [TRACK_TYPES.JOURNEY]: journeys,
            [TRACK_TYPES.VOW]: vows,
          };
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

  addTrack: (type, track) => {
    const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
    return addProgressTrack({ campaignId, track, type });
  },
  updateTrack: (type, trackId, track) => {
    const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
    return updateProgressTrack({ campaignId, trackId, track, type });
  },
  updateTrackValue(type, trackId, value) {
    const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
    return updateProgressTrackValue({ campaignId, trackId, value, type });
  },
  removeTrack(type, trackId) {
    const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
    return removeProgressTrack({ campaignId, id: trackId, type });
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
