import { DocumentReference, doc } from "firebase/firestore";
import { constructHomebrewCollectionDocPath } from "../_getRef";
import { firestore } from "config/firebase.config";
import { DictKey, OracleTablesCollection } from "@datasworn/core";

function constructHomebrewOracleDocPath(homebrewId: string) {
  return `${constructHomebrewCollectionDocPath(homebrewId)}/oracles/oracles`;
}

export function getHomebrewOraclesDoc(homebrewId: string) {
  return doc(
    firestore,
    constructHomebrewOracleDocPath(homebrewId)
  ) as DocumentReference<Record<DictKey, OracleTablesCollection>>;
}
