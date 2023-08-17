import { firebaseAuth } from "config/firebase.config";
import { onSnapshot, setDoc } from "firebase/firestore";
import { StoredMove } from "types/Moves.type";
import { getUserCustomMovesDoc } from "./_getRef";

export function listenToCustomMoves(
  uid: string,
  onCustomMoves: (moves: StoredMove[]) => void,
  onError: (error: any) => void
) {
  return onSnapshot(
    getUserCustomMovesDoc(uid),
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onCustomMoves(data.moveOrder.map((moveId) => data.moves[moveId]));
      } else if (uid === firebaseAuth.currentUser?.uid) {
        setDoc(getUserCustomMovesDoc(uid), {
          moves: {},
          moveOrder: [],
        });
      } else {
        onCustomMoves([]);
      }
    },
    (error) => onError(error)
  );
}
