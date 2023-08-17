import { firestore } from "config/firebase.config";
import { doc, DocumentReference } from "firebase/firestore";
import { UserDocument } from "types/User.type";

export function constructUserDocPath(userId: string) {
  return `/users/${userId}`;
}

export function getUsersDoc(userId: string) {
  return doc(
    firestore,
    constructUserDocPath(userId)
  ) as DocumentReference<UserDocument>;
}
