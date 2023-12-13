import { DocumentReference, doc } from "firebase/firestore";
import { constructHomebrewCollectionDocPath } from "../_getRef";
import { firestore } from "config/firebase.config";
import { StoredRules } from "types/HomebrewCollection.type";
import { Rules } from "@datasworn/core";

export function constructHomebrewRulesDocPath(homebrewId: string) {
  return `${constructHomebrewCollectionDocPath(homebrewId)}/rules/rules`;
}

export function getHomebrewRulesDoc(homebrewId: string) {
  return doc(
    firestore,
    constructHomebrewRulesDocPath(homebrewId)
  ) as DocumentReference<ReplaceRecord<Rules>>;
}

export type ReplaceRecord<T> = {
  [P in keyof T]: T[P] extends Record<infer A, infer B>
    ? { [key in A]: B }
    : T[P] extends object
    ? ReplaceRecord<T[P]>
    : T[P];
};
