import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { firestore } from "../config/firebase.config";
import { AssetDocument, CharacterDocument } from "../types/Character.type";

export function constructUsersCharacterCollectionPath(userId: string) {
  return `/characters/${userId}/characters`;
}

export function constructCharacterDocPath(userId: string, characterId: string) {
  return `/characters/${userId}/characters/${characterId}`;
}

export function constructCharacterAssetDocPath(
  userId: string,
  characterId: string
) {
  return `/characters/${userId}/characters/${characterId}/assets/assets`;
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

export function getCharacterAssetDoc(userId: string, characterId: string) {
  return doc(
    firestore,
    constructCharacterAssetDocPath(userId, characterId)
  ) as DocumentReference<AssetDocument>;
}
