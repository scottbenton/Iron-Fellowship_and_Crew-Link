import {
  CollectionReference,
  DocumentReference,
  collection,
  doc,
} from "firebase/firestore";
import { firestore } from "config/firebase.config";
import { StoredMoveCategory } from "types/homebrew/HomebrewMoves.type";

export function constructHomebrewMoveCategoryCollectionPath() {
  return `homebrew/homebrew/move_categories`;
}

export function constructHomebrewMoveCategoryDocPath(categoryId: string) {
  return `${constructHomebrewMoveCategoryCollectionPath()}/${categoryId}`;
}

export function getHomebrewMoveCategoryCollection() {
  return collection(
    firestore,
    constructHomebrewMoveCategoryCollectionPath()
  ) as CollectionReference<StoredMoveCategory>;
}

export function getHomebrewMoveCategoryDoc(categoryId: string) {
  return doc(
    firestore,
    constructHomebrewMoveCategoryDocPath(categoryId)
  ) as DocumentReference<StoredMoveCategory>;
}
