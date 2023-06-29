import { firestore } from "config/firebase.config";
import { collection, CollectionReference } from "firebase/firestore";
import { Roll } from "types/DieRolls.type";

export function constructCharacterRollsCollectionPath(
  userId: string,
  characterId: string
) {
  return `/characters/${userId}/characters/${characterId}/rolls`;
}

export function getCharacterRollsCollection(
  userId: string,
  characterId: string
) {
  return collection(
    firestore,
    constructCharacterRollsCollectionPath(userId, characterId)
  ) as CollectionReference<Roll>;
}
