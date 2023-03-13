import { firestore } from "config/firebase.config";
import { doc, DocumentReference } from "firebase/firestore";
import { CharacterSettingsDoc } from "types/Settings.type";

export function constructCharacterSettingsDocPath(
  userId: string,
  characterId: string
) {
  return `/characters/${userId}/characters/${characterId}/settings/settings`;
}

export function getCharacterSettingsDoc(userId: string, characterId: string) {
  return doc(
    firestore,
    constructCharacterSettingsDocPath(userId, characterId)
  ) as DocumentReference<CharacterSettingsDoc>;
}
