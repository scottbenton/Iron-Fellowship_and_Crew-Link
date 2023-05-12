import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  Timestamp,
} from "firebase/firestore";
import {
  GMNPCDocument,
  NPCDocument,
  NPCDocumentFirestore,
  NPCNotesDocument,
} from "types/NPCs.type";

export function constructNPCCollectionPath(uid: string, worldId: string) {
  return `/users/${uid}/worlds/${worldId}/npcs`;
}

export function constructNPCDocPath(
  uid: string,
  worldId: string,
  npcId: string
) {
  return `/users/${uid}/worlds/${worldId}/npcs/${npcId}`;
}

export function constructPrivateDetailsNPCDocPath(
  uid: string,
  worldId: string,
  npcId: string
) {
  return constructNPCDocPath(uid, worldId, npcId) + `/private/details`;
}

export function constructPublicNotesNPCDocPath(
  uid: string,
  worldId: string,
  npcId: string
) {
  return constructNPCDocPath(uid, worldId, npcId) + `/public/notes`;
}

export function getNPCCollection(uid: string, worldId: string) {
  return collection(
    firestore,
    constructNPCCollectionPath(uid, worldId)
  ) as CollectionReference<NPCDocumentFirestore>;
}

export function getNPCDoc(uid: string, worldId: string, npcId: string) {
  return doc(
    firestore,
    constructNPCDocPath(uid, worldId, npcId)
  ) as DocumentReference<NPCDocumentFirestore>;
}

export function getPrivateDetailsNPCDoc(
  uid: string,
  worldId: string,
  npcId: string
) {
  return doc(
    firestore,
    constructPrivateDetailsNPCDocPath(uid, worldId, npcId)
  ) as DocumentReference<GMNPCDocument>;
}

export function getPublicNotesNPCDoc(
  uid: string,
  worldId: string,
  npcId: string
) {
  return doc(
    firestore,
    constructPublicNotesNPCDocPath(uid, worldId, npcId)
  ) as DocumentReference<NPCNotesDocument>;
}

export function convertToDatabase(
  npc: Partial<NPCDocument>
): Partial<NPCDocumentFirestore> {
  const { updatedDate, ...restNPC } = npc;
  return {
    updatedTimestamp: Timestamp.now(),
    ...restNPC,
  };
}
export function convertFromDatabase(npc: NPCDocumentFirestore): NPCDocument {
  const { updatedTimestamp, ...restNPC } = npc;
  return {
    updatedDate: updatedTimestamp.toDate(),
    ...restNPC,
  };
}
