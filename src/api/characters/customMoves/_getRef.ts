import { firestore } from "config/firebase.config";
import { doc, DocumentReference } from "firebase/firestore";
import { MoveDocument } from "types/Moves.type";

export function constructCharacterCustomMovesDocPath(
  uid: string,
  characterId: string
) {
  return `/characters/${uid}/characters/${characterId}/settings/moves`;
}

export function getCharacterCustomMovesDoc(uid: string, characterId: string) {
  return doc(
    firestore,
    constructCharacterCustomMovesDocPath(uid, characterId)
  ) as DocumentReference<MoveDocument>;
}
