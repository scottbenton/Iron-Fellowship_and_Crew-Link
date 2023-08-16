import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { StoredAsset } from "types/Asset.type";

export function constructCharacterAssetCollectionPath(characterId: string) {
  return `/characters/${characterId}/assets`;
}

export function constructCharacterAssetDocPath(
  characterId: string,
  assetId: string
) {
  return `/characters/${characterId}/assets/${assetId}`;
}

export function getCharacterAssetCollection(characterId: string) {
  return collection(
    firestore,
    constructCharacterAssetCollectionPath(characterId)
  ) as CollectionReference<StoredAsset>;
}

export function getCharacterAssetDoc(characterId: string, assetId: string) {
  return doc(
    firestore,
    constructCharacterAssetDocPath(characterId, assetId)
  ) as DocumentReference<StoredAsset>;
}
