import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { setDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getSharedCampaignTracksDoc } from "./_getRef";
import { StoredTrack, TRACK_TYPES } from "types/Track.type";

export const addCampaignProgressTrack: ApiFunction<
  {
    campaignId?: string;
    type: TRACK_TYPES;
    track: StoredTrack;
  },
  boolean
> = function (params) {
  const { campaignId, type, track } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId) {
      reject(new CampaignNotFoundException());
      return;
    }

    setDoc(
      getSharedCampaignTracksDoc(campaignId),
      {
        [type]: {
          [track.label + track.createdTimestamp.toString()]: track,
        },
      },
      { merge: true }
    )
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to add track");
      });
  });
};

export function useAddCampaignProgressTrack() {
  const { call, loading, error } = useApiState(addCampaignProgressTrack);

  return {
    addCampaignProgressTrack: call,
    loading,
    error,
  };
}

export function useCharacterSheetAddCampaignProgressTrack() {
  const { addCampaignProgressTrack, loading, error } =
    useAddCampaignProgressTrack();

  const campaignId = useCharacterSheetStore((store) => store.campaignId);
  return {
    addCampaignProgressTrack: (params: {
      type: TRACK_TYPES;
      track: StoredTrack;
    }) => addCampaignProgressTrack({ campaignId, ...params }),
    loading,
    error,
  };
}
