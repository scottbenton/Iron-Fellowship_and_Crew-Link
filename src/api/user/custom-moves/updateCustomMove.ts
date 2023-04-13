import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import {
  arrayRemove,
  arrayUnion,
  deleteField,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getUserCustomMovesDoc } from "./_getRef";
import { StoredMove } from "types/Moves.type";
import { useCampaignGMScreenStore } from "features/campaign-gm-screen/campaignGMScreen.store";
import { firestore } from "config/firebase.config";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useAuth } from "providers/AuthProvider";

export const updateCustomMove: ApiFunction<
  {
    uid?: string;
    moveId: string;
    customMove: StoredMove;
  },
  boolean
> = function (params) {
  const { uid, moveId, customMove } = params;

  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }

    const encodedId = encodeDataswornId(customMove.$id);
    if (moveId !== customMove.$id) {
      const oldEncodedId = encodeDataswornId(moveId);

      const batch = writeBatch(firestore);
      batch.update(getUserCustomMovesDoc(uid), {
        [`moves.${encodedId}`]: customMove,
        [`moves.${oldEncodedId}`]: deleteField(),
        moveOrder: arrayRemove(oldEncodedId),
      });
      batch.update(getUserCustomMovesDoc(uid), {
        moveOrder: arrayUnion(encodedId),
      });

      batch
        .commit()
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          console.error(err);
          reject("Failed to update custom move");
        });
    } else {
      updateDoc(getUserCustomMovesDoc(uid), {
        [`moves.${encodedId}`]: customMove,
      })
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          reject("Failed to update custom move");
        });
    }
  });
};

export function useUpdateCustomMove() {
  const { call, loading, error } = useApiState(updateCustomMove);

  const uid = useAuth().user?.uid;

  return {
    updateCustomMove: (moveId: string, customMove: StoredMove) =>
      call({ uid, moveId, customMove }),
    loading,
    error,
  };
}
