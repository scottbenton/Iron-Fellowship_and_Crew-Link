import { firestore } from "config/firebase.config";
import {
  CollectionReference,
  DocumentReference,
  collection,
  doc,
} from "firebase/firestore";
import { HomebrewCollectionDocument } from "types/homebrew/HomebrewCollection.type";

export function constructHomebrewCollectionPath() {
  return "/homebrew/homebrew/collections";
}

export function constructHomebrewCollectionDocPath(
  homebrewCollectionId: string
) {
  return `${constructHomebrewCollectionPath()}/${homebrewCollectionId}`;
}

export function getHomebrewCollection() {
  return collection(
    firestore,
    constructHomebrewCollectionPath()
  ) as CollectionReference<HomebrewCollectionDocument>;
}

export function getHomebrewCollectionDoc(homebrewCollectionId: string) {
  return doc(
    firestore,
    constructHomebrewCollectionDocPath(homebrewCollectionId)
  ) as DocumentReference<HomebrewCollectionDocument>;
}
