import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { deleteField, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getSharedCampaignTracksCollection } from "lib/firebase.lib";
import { TRACK_TYPES } from "types/Track.type";

export const removeCampaignProgressTrack: ApiFunction<
  {
    campaignId?: string;
    type: TRACK_TYPES;
    id: string;
  },
  boolean
> = function (params) {
  const { campaignId, type, id } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId) {
      reject(new CampaignNotFoundException());
      return;
    }

    updateDoc(getSharedCampaignTracksCollection(campaignId), {
      [`${type}.${id}`]: deleteField(),
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to remove progress track");
      });
  });
};

export function useRemoveCampaignProgressTrack() {
  const { call, loading, error } = useApiState(removeCampaignProgressTrack);

  return {
    removeCampaignProgressTrack: call,
    loading,
    error,
  };
}

export function useCharacterSheetRemoveCampaignProgressTrack() {
  const { removeCampaignProgressTrack, loading, error } =
    useRemoveCampaignProgressTrack();

  const campaignId = useCharacterSheetStore((store) => store.campaignId);

  return {
    removeCampaignProgressTrack: (params: { type: TRACK_TYPES; id: string }) =>
      removeCampaignProgressTrack({ campaignId, ...params }),
    loading,
    error,
  };
}
