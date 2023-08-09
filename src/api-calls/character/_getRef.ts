import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { CharacterDocument } from "types/Character.type";

export function constructCharacterCollectionPath() {
  return `/characters`;
}

export function constructCharacterDocPath(characterId: string) {
  return `/characters/${characterId}`;
}

export function constructCharacterPortraitPath(
  uid: string,
  characterId: string,
  filename: string
) {
  return `/characters/${uid}/characters/${characterId}/${filename}`;
}

export function getCharacterCollection() {
  return collection(
    firestore,
    constructCharacterCollectionPath()
  ) as CollectionReference<CharacterDocument>;
}

export function getCharacterDoc(characterId: string) {
  return doc(
    firestore,
    constructCharacterDocPath(characterId)
  ) as DocumentReference<CharacterDocument>;
}
