import { firestore } from "config/firebase.config";
import {
  CollectionReference,
  DocumentReference,
  collection,
  doc,
} from "firebase/firestore";
import { IAccessibilitySettings } from "types/UserAccessibilitySettings.type";

export function constructUserSettingsCollectionPath(userId: string) {
  return `/users/${userId}/settings`;
}

export function constructUserAccessibilitySettingsDocPath(userId: string) {
  return `/users/${userId}/settings/accessibility`;
}

export function getUserSettingsCollectionRef(userId: string) {
  return collection(
    firestore,
    constructUserSettingsCollectionPath(userId)
  ) as CollectionReference<any>;
}

export function getUserAccessibilitySettingsDoc(userId: string) {
  return doc(
    firestore,
    constructUserAccessibilitySettingsDocPath(userId)
  ) as DocumentReference<IAccessibilitySettings>;
}
