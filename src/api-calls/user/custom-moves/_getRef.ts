import { firestore } from "config/firebase.config";
import { doc, DocumentReference } from "firebase/firestore";
import { MoveDocument } from "types/Moves.type";

export function constructUserCustomMovesDocPath(userId: string) {
  return `/users/${userId}/custom-moves/custom-moves`;
}

export function getUserCustomMovesDoc(userId: string) {
  return doc(
    firestore,
    constructUserCustomMovesDocPath(userId)
  ) as DocumentReference<MoveDocument>;
}
