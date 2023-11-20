import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { OracleSettings } from "types/UserOracleSettings.type";

export function constructUserSettingsCollectionPath(userId: string) {
  return `/users/${userId}/settings`;
}

export function constructUserOracleSettingsDocPath(userId: string) {
  return `/users/${userId}/settings/oracle`;
}

export function getUserSettingsCollectionRef(userId: string) {
  return collection(
    firestore,
    constructUserSettingsCollectionPath(userId)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as CollectionReference<any>;
}

export function getUserOracleSettingsDoc(userId: string) {
  return doc(
    firestore,
    constructUserOracleSettingsDocPath(userId)
  ) as DocumentReference<OracleSettings>;
}
