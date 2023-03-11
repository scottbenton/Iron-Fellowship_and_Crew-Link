import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { arrayRemove, deleteField, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getCampaignCustomMovesDoc } from "./_getRef";
import { useCampaignGMScreenStore } from "features/campaign-gm-screen/campaignGMScreen.store";
import { encodeDataswornId } from "functions/dataswornIdEncoder";

export const removeCampaignCustomMove: ApiFunction<
  {
    campaignId?: string;
    moveId: string;
  },
  boolean
> = function (params) {
  const { campaignId, moveId } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId) {
      reject(new CampaignNotFoundException());
      return;
    }
    const encodedId = encodeDataswornId(moveId);
    updateDoc(getCampaignCustomMovesDoc(campaignId), {
      [`moves.${encodedId}`]: deleteField(),
      moveOrder: arrayRemove(moveId),
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to remove custom move");
      });
  });
};

export function useRemoveCampaignCustomMove() {
  const { call, loading, error } = useApiState(removeCampaignCustomMove);

  return {
    removeCampaignCustomMove: call,
    loading,
    error,
  };
}

export function useCampaignGMScreenRemoveCampaignCustomMove() {
  const { call, loading, error } = useApiState(removeCampaignCustomMove);

  const campaignId = useCampaignGMScreenStore((store) => store.campaignId);

  return {
    removeCampaignCustomMove: (moveId: string) => call({ campaignId, moveId }),
    loading,
    error,
  };
}
