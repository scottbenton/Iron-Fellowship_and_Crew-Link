import { arrayUnion, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getUserCustomMovesDoc } from "./_getRef";
import { StoredMove } from "types/Moves.type";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useAuth } from "providers/AuthProvider";

export const addCustomMove: ApiFunction<
  {
    uid?: string;
    customMove: StoredMove;
  },
  boolean
> = function (params) {
  const { uid, customMove } = params;

  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }

    const encodedId = encodeDataswornId(customMove.$id);
    updateDoc(getUserCustomMovesDoc(uid), {
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

export function useAddCustomMove() {
  const { call, loading, error } = useApiState(addCustomMove);

  const uid = useAuth().user?.uid;

  return {
    addCustomMove: (customMove: StoredMove) => call({ uid, customMove }),
    loading,
    error,
  };
}
