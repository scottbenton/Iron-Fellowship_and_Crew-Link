import {
  CollectionReference,
  DocumentReference,
  collection,
  doc,
} from "firebase/firestore";
import { firestore } from "config/firebase.config";
import { StoredStat } from "types/homebrew/HomebrewRules.type";

export function constructHomebrewStatsCollectionPath() {
  return `homebrew/homebrew/stats`;
}

export function constructHomebrewStatsDocPath(statId: string) {
  return `${constructHomebrewStatsCollectionPath()}/${statId}`;
}

export function getHomebrewStatsCollection() {
  return collection(
    firestore,
    constructHomebrewStatsCollectionPath()
  ) as CollectionReference<StoredStat>;
}

export function getHomebrewStatsDoc(statId: string) {
  return doc(
    firestore,
    constructHomebrewStatsDocPath(statId)
  ) as DocumentReference<StoredStat>;
}
