import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getSharedCampaignTracksDoc } from "./_getRef";
import { TRACK_TYPES } from "types/Track.type";

export const updateCampaignProgressTrackValue: ApiFunction<
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

export function useUpdateCampaignProgressTrackValue() {
  const { call, loading, error } = useApiState(
    updateCampaignProgressTrackValue
  );

  return {
    updateCampaignProgressTrackValue: call,
    loading,
    error,
  };
}

export function useUpdateCharacterSheetCampaignProgressTrackValue() {
  const campaignId = useCharacterSheetStore((store) => store.campaignId);

  const { updateCampaignProgressTrackValue, loading, error } =
    useUpdateCampaignProgressTrackValue();

  return {
    updateCampaignProgressTrackValue: (params: {
      type: TRACK_TYPES;
      trackId: string;
      value: number;
    }) => updateCampaignProgressTrackValue({ ...params, campaignId }),
    loading,
    error,
  };
}
