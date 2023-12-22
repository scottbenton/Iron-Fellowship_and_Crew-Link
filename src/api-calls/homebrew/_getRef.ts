import { firestore } from "config/firebase.config";
import {
  CollectionReference,
  DocumentReference,
  collection,
  doc,
} from "firebase/firestore";
import { BaseExpansionOrRuleset } from "types/homebrew/HomebrewCollection.type";

export function constructHomebrewCollectionPath() {
  return "/homebrew";
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
  ) as CollectionReference<BaseExpansionOrRuleset>;
}

export function getHomebrewCollectionDoc(homebrewCollectionId: string) {
  return doc(
    firestore,
    constructHomebrewCollectionDocPath(homebrewCollectionId)
  ) as DocumentReference<BaseExpansionOrRuleset>;
}
