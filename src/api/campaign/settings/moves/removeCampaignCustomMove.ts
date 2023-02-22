import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { arrayRemove, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getCampaignCustomMoveDoc } from "./_getRef";
import { Move } from "types/Moves.type";

export const removeCampaignCustomMove: ApiFunction<
  {
    campaignId: string;
    customMove: Move;
  },
  boolean
> = function (params) {
  const { campaignId, customMove } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId) {
      reject(new CampaignNotFoundException());
      return;
    }

    updateDoc(getCampaignCustomMoveDoc(campaignId), {
      moves: arrayRemove(customMove),
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
