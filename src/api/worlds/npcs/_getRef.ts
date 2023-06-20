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

export function constructNPCCollectionPath(worldId: string) {
  return `/worlds/${worldId}/npcs`;
}

export function constructNPCDocPath(worldId: string, npcId: string) {
  return `/worlds/${worldId}/npcs/${npcId}`;
}

export function constructPrivateDetailsNPCDocPath(
  worldId: string,
  npcId: string
) {
  return constructNPCDocPath(worldId, npcId) + `/private/details`;
}

export function constructPublicNotesNPCDocPath(worldId: string, npcId: string) {
  return constructNPCDocPath(worldId, npcId) + `/public/notes`;
}

export function constructNPCImagesPath(worldId: string, npcId: string) {
  return `/worlds/${worldId}/npcs/${npcId}`;
}

export function constructNPCImagePath(
  worldId: string,
  npcId: string,
  filename: string
) {
  return `/worlds/${worldId}/npcs/${npcId}/${filename}`;
}

export function getNPCCollection(worldId: string) {
  return collection(
    firestore,
    constructNPCCollectionPath(worldId)
  ) as CollectionReference<NPCDocumentFirestore>;
}

export function getNPCDoc(worldId: string, npcId: string) {
  return doc(
    firestore,
    constructNPCDocPath(worldId, npcId)
  ) as DocumentReference<NPCDocumentFirestore>;
}

export function getPrivateDetailsNPCDoc(worldId: string, npcId: string) {
  return doc(
    firestore,
    constructPrivateDetailsNPCDocPath(worldId, npcId)
  ) as DocumentReference<GMNPCDocument>;
}

export function getPublicNotesNPCDoc(worldId: string, npcId: string) {
  return doc(
    firestore,
    constructPublicNotesNPCDocPath(worldId, npcId)
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
