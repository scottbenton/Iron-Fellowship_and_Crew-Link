import { firestore } from "config/firebase.config";
import { doc, DocumentReference } from "firebase/firestore";
import { OracleSettings } from "types/UserSettings.type";

export function constructUserOracleSettingsDocPath(userId: string) {
  return `/users/${userId}/settings/oracle`;
}

export function getUserOracleSettingsDoc(userId: string) {
  return doc(
    firestore,
    constructUserOracleSettingsDocPath(userId)
  ) as DocumentReference<OracleSettings>;
}
