import { firestore } from "config/firebase.config";
import { doc, DocumentReference } from "firebase/firestore";
import { OracleDocument } from "types/Oracles.type";

export function constructUserCustomOracleDocPath(userId: string) {
  return `/users/${userId}/custom-oracles/custom-oracles`;
}

export function getUsersCustomOracleDoc(userId: string) {
  return doc(
    firestore,
    constructUserCustomOracleDocPath(userId)
  ) as DocumentReference<OracleDocument>;
}
