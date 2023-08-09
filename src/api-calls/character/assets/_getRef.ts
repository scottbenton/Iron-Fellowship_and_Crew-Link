import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { StoredAsset } from "types/Asset.type";
import { AssetDocument } from "types/Character.type";

export function constructCharacterAssetCollectionPath(characterId: string) {
  return `/characters/${characterId}/assets`;
}

export function constructCharacterAssetDocPath(characterId: string) {
  return `/characters/${characterId}/assets/assets`;
}

export function getCharacterAssetCollection(characterId: string) {
  return collection(
    firestore,
    constructCharacterAssetCollectionPath(characterId)
  ) as CollectionReference<StoredAsset>;
}

export function getCharacterAssetDoc(characterId: string) {
  return doc(
    firestore,
    constructCharacterAssetDocPath(characterId)
  ) as DocumentReference<AssetDocument>;
}
