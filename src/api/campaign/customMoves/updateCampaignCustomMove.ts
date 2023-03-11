import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import {
  arrayRemove,
  arrayUnion,
  deleteField,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getCampaignCustomMovesDoc } from "./_getRef";
import { StoredMove } from "types/Moves.type";
import { useCampaignGMScreenStore } from "features/campaign-gm-screen/campaignGMScreen.store";
import { firestore } from "config/firebase.config";
import { encodeDataswornId } from "functions/dataswornIdEncoder";

export const updateCampaignCustomMove: ApiFunction<
  {
    campaignId?: string;
    moveId: string;
    customMove: StoredMove;
  },
  boolean
> = function (params) {
  const { campaignId, moveId, customMove } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId) {
      reject(new CampaignNotFoundException());
      return;
    }

    const encodedId = encodeDataswornId(customMove.$id);
    if (moveId !== customMove.$id) {
      const oldEncodedId = encodeDataswornId(moveId);

      const batch = writeBatch(firestore);
      batch.update(getCampaignCustomMovesDoc(campaignId), {
        [`moves.${encodedId}`]: customMove,
        [`moves.${oldEncodedId}`]: deleteField(),
        moveOrder: arrayRemove(oldEncodedId),
      });
      batch.update(getCampaignCustomMovesDoc(campaignId), {
        moveOrder: arrayUnion(encodedId),
      });

      batch
        .commit()
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          console.error(err);
          reject("Failed to update custom campaign move");
        });
    } else {
      updateDoc(getCampaignCustomMovesDoc(campaignId), {
        [`moves.${encodedId}`]: customMove,
      })
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          reject("Failed to add track");
        });
    }
  });
};

export function useUpdateCampaignCustomMove() {
  const { call, loading, error } = useApiState(updateCampaignCustomMove);

  return {
    updateCampaignCustomMove: call,
    loading,
    error,
  };
}

export function useCampaignGMScreenUpdateCustomMove() {
  const { updateCampaignCustomMove, loading, error } =
    useUpdateCampaignCustomMove();

  const campaignId = useCampaignGMScreenStore((store) => store.campaignId);

  return {
    updateCampaignCustomMove: (moveId: string, move: StoredMove) =>
      updateCampaignCustomMove({ campaignId, moveId, customMove: move }),
    loading,
    error,
  };
}
