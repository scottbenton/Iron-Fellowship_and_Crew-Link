import {
  CollectionReference,
  DocumentReference,
  collection,
  doc,
} from "firebase/firestore";
import { firestore } from "config/firebase.config";
import { StoredImpactCategory } from "types/homebrew/HomebrewRules.type";

export function constructHomebrewImpactsCollectionPath() {
  return `homebrew/homebrew/impacts`;
}

export function constructHomebrewImpactsDocPath(impactCategoryId: string) {
  return `${constructHomebrewImpactsCollectionPath()}/${impactCategoryId}`;
}

export function getHomebrewImpactsCollection() {
  return collection(
    firestore,
    constructHomebrewImpactsCollectionPath()
  ) as CollectionReference<StoredImpactCategory>;
}

export function getHomebrewImpactsDoc(impactCategoryId: string) {
  return doc(
    firestore,
    constructHomebrewImpactsDocPath(impactCategoryId)
  ) as DocumentReference<StoredImpactCategory>;
}
