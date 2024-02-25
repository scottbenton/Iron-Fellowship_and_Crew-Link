import {
  CollectionReference,
  DocumentReference,
  collection,
  doc,
} from "firebase/firestore";
import { firestore } from "config/firebase.config";
import { StoredOracleCollection } from "types/homebrew/HomebrewOracles.type";

export function constructHomebrewOracleCollectionCollectionPath() {
  return `homebrew/homebrew/oracle_collections`;
}

export function constructHomebrewOracleCollectionDocPath(collectionId: string) {
  return `${constructHomebrewOracleCollectionCollectionPath()}/${collectionId}`;
}

export function getHomebrewOracleCollectionCollection() {
  return collection(
    firestore,
    constructHomebrewOracleCollectionCollectionPath()
  ) as CollectionReference<StoredOracleCollection>;
}

export function getHomebrewOracleCollectionDoc(collectionId: string) {
  return doc(
    firestore,
    constructHomebrewOracleCollectionDocPath(collectionId)
  ) as DocumentReference<StoredOracleCollection>;
}
