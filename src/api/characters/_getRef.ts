import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { CharacterDocument } from "types/Character.type";

export function constructUsersCharacterCollectionPath(userId: string) {
  return `/characters/${userId}/characters`;
}

export function constructCharacterDocPath(userId: string, characterId: string) {
  return `/characters/${userId}/characters/${characterId}`;
}

export function constructCharacterPortraitPath(
  userId: string,
  characterId: string,
  filename: string
) {
  return `/characters/${userId}/characters/${characterId}/${filename}`;
}

export function getUsersCharacterCollection(userId: string) {
  return collection(
    firestore,
    constructUsersCharacterCollectionPath(userId)
  ) as CollectionReference<CharacterDocument>;
}

export function getCharacterDoc(userId: string, characterId: string) {
  return doc(
    firestore,
    constructCharacterDocPath(userId, characterId)
  ) as DocumentReference<CharacterDocument>;
}
