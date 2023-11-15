import { arrayRemove, deleteField, updateDoc } from "firebase/firestore";
import { getUserCustomMovesDoc } from "./_getRef";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { createApiFunction } from "api-calls/createApiFunction";

export const removeCustomMove = createApiFunction<
  {
    uid: string;
    moveId: string;
  },
  void
>((params) => {
  const { uid, moveId } = params;

  return new Promise((resolve, reject) => {
    const encodedId = encodeDataswornId(moveId);
    updateDoc(getUserCustomMovesDoc(uid), {
      [`moves.${encodedId}`]: deleteField(),
      moveOrder: arrayRemove(encodedId),
    })
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to remove custom move.");
