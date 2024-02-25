import {
  CollectionReference,
  DocumentReference,
  collection,
  doc,
} from "firebase/firestore";
import { firestore } from "config/firebase.config";
import { StoredConditionMeter } from "types/homebrew/HomebrewRules.type";

export function constructHomebrewConditionMeterCollectionPath() {
  return `homebrew/homebrew/condition_meters`;
}

export function constructHomebrewConditionMeterDocPath(
  conditionMeterId: string
) {
  return `${constructHomebrewConditionMeterCollectionPath()}/${conditionMeterId}`;
}

export function getHomebrewConditionMeterCollection() {
  return collection(
    firestore,
    constructHomebrewConditionMeterCollectionPath()
  ) as CollectionReference<StoredConditionMeter>;
}

export function getHomebrewConditionMeterDoc(conditionMeterId: string) {
  return doc(
    firestore,
    constructHomebrewConditionMeterDocPath(conditionMeterId)
  ) as DocumentReference<StoredConditionMeter>;
}
