import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { arrayUnion, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getCampaignCustomMovesDoc } from "./_getRef";
import { getCustomMoveDatabaseId, StoredMove } from "types/Moves.type";
import { useCampaignGMScreenStore } from "features/campaign-gm-screen/campaignGMScreen.store";

export const addCampaignCustomMove: ApiFunction<
  {
    campaignId?: string;
    customMove: StoredMove;
  },
  boolean
> = function (params) {
  const { campaignId, customMove } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId) {
      reject(new CampaignNotFoundException());
      return;
    }

    const id = getCustomMoveDatabaseId(customMove.name);

    updateDoc(getCampaignCustomMovesDoc(campaignId), {
      [`moves.${id}`]: customMove,
      moveOrder: arrayUnion(id),
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to add track");
      });
  });
};

export function useAddCampaignCustomMove() {
  const { call, loading, error } = useApiState(addCampaignCustomMove);

  return {
    addCampaignCustomMove: call,
    loading,
    error,
  };
}

export function useCampaignGMScreenAddCustomMove() {
  const { addCampaignCustomMove, loading, error } = useAddCampaignCustomMove();

  const campaignId = useCampaignGMScreenStore((store) => store.campaignId);

  return {
    addCampaignCustomMove: (move: StoredMove) =>
      addCampaignCustomMove({ campaignId, customMove: move }),
    loading,
    error,
  };
}
