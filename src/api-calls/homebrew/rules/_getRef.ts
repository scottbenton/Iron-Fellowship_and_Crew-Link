import { DocumentReference, doc } from "firebase/firestore";
import { constructHomebrewCollectionDocPath } from "../_getRef";
import { firestore } from "config/firebase.config";
import { StoredRules } from "types/HomebrewCollection.type";

export function constructHomebrewRulesDocPath(homebrewId: string) {
  return `${constructHomebrewCollectionDocPath(homebrewId)}/rules/rules`;
}

export function getHomebrewRulesDoc(homebrewId: string) {
  return doc(
    firestore,
    constructHomebrewRulesDocPath(homebrewId)
  ) as DocumentReference<Partial<StoredRules>>;
}
