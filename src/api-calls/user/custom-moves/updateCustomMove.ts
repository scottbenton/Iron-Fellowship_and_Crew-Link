import {
  arrayRemove,
  arrayUnion,
  deleteField,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { getUserCustomMovesDoc } from "./_getRef";
import { StoredMove } from "types/Moves.type";
import { firestore } from "config/firebase.config";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateCustomMove = createApiFunction<
  {
    uid: string;
    moveId: string;
    customMove: StoredMove;
  },
  void
>((params) => {
  const { uid, moveId, customMove } = params;

  return new Promise((resolve, reject) => {
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
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      updateDoc(getUserCustomMovesDoc(uid), {
        [`moves.${encodedId}`]: customMove,
      })
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
}, "Failed to update custom move.");
