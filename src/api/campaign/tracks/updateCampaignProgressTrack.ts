import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getSharedCampaignTracksDoc } from "./_getRef";
import { TRACK_TYPES } from "types/Track.type";

export const updateCampaignProgressTrack: ApiFunction<
  {
    campaignId?: string;
    type: TRACK_TYPES;
    trackId: string;
    value: number;
  },
  boolean
> = function (params) {
  const { campaignId, type, trackId, value } = params;
  return new Promise((resolve, reject) => {
    if (!campaignId) {
      reject(new CampaignNotFoundException());
      return;
    }

    updateDoc(
      getSharedCampaignTracksDoc(campaignId),
      //@ts-ignore
      {
        [`${type}.${trackId}.value`]: value,
      }
    )
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update progress track");
      });
  });
};

export function useUpdateCampaignProgressTrack() {
  const { call, loading, error } = useApiState(updateCampaignProgressTrack);

  return {
    updateCampaignProgressTrack: call,
    loading,
    error,
  };
}

export function useUpdateCharacterSheetCampaignProgressTrack() {
  const campaignId = useCharacterSheetStore((store) => store.campaignId);

  const { updateCampaignProgressTrack, loading, error } =
    useUpdateCampaignProgressTrack();

  return {
    updateCampaignProgressTrack: (params: {
      type: TRACK_TYPES;
      trackId: string;
      value: number;
    }) => updateCampaignProgressTrack({ ...params, campaignId }),
    loading,
    error,
  };
}
