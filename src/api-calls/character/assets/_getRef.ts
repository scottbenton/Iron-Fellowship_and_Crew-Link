import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { StoredAsset } from "types/Asset.type";
import { AssetDocument } from "types/Character.type";

export function constructCharacterAssetCollectionPath(
  userId: string,
  characterId: string
) {
  return `/characters/${userId}/characters/${characterId}/assets`;
}

export function constructCharacterAssetDocPath(
  userId: string,
  characterId: string
) {
  return `/characters/${userId}/characters/${characterId}/assets/assets`;
}

export function getCharacterAssetCollection(
  userId: string,
  characterId: string
) {
  return collection(
    firestore,
    constructCharacterAssetCollectionPath(userId, characterId)
  ) as CollectionReference<StoredAsset>;
}

export function getCharacterAssetDoc(userId: string, characterId: string) {
  return doc(
    firestore,
    constructCharacterAssetDocPath(userId, characterId)
  ) as DocumentReference<AssetDocument>;
}
