import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { arrayUnion, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getCampaignCustomMovesDoc } from "./_getRef";
import { StoredMove } from "types/Moves.type";
import { useCampaignGMScreenStore } from "features/campaign-gm-screen/campaignGMScreen.store";
import { encodeDataswornId } from "functions/dataswornIdEncoder";

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

    const encodedId = encodeDataswornId(customMove.$id);
    updateDoc(getCampaignCustomMovesDoc(campaignId), {
      [`moves.${encodedId}`]: customMove,
      moveOrder: arrayUnion(encodedId),
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to add move");
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
