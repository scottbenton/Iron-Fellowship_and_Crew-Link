import { arrayRemove, deleteField, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getUserCustomMovesDoc } from "./_getRef";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { useAuth } from "hooks/useAuth";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";

export const removeCustomMove: ApiFunction<
  {
    uid?: string;
    moveId: string;
  },
  boolean
> = function (params) {
  const { uid, moveId } = params;

  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }
    const encodedId = encodeDataswornId(moveId);
    updateDoc(getUserCustomMovesDoc(uid), {
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

export function useRemoveCustomMove() {
  const { call, loading, error } = useApiState(removeCustomMove);

  const uid = useAuth().user?.uid;

  return {
    removeCustomMove: (moveId: string) => call({ uid, moveId }),
    loading,
    error,
  };
}
