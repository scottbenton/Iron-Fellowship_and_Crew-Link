import { arrayUnion, updateDoc } from "firebase/firestore";
import { getUserCustomMovesDoc } from "./_getRef";
import { StoredMove } from "types/Moves.type";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { createApiFunction } from "api-calls/createApiFunction";

export const addCustomMove = createApiFunction<
  {
    uid: string;
    customMove: StoredMove;
  },
  void
>((params) => {
  const { uid, customMove } = params;

  return new Promise((resolve, reject) => {
    const encodedId = encodeDataswornId(customMove.$id);
    updateDoc(getUserCustomMovesDoc(uid), {
      [`moves.${encodedId}`]: customMove,
      moveOrder: arrayUnion(encodedId),
    })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to add custom move.");
