import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  Timestamp,
} from "firebase/firestore";
import {
  StoredGMNPCDocument,
  NPCDocument,
  NPCNotesDocument,
  NPCDocumentFirestore,
} from "types/NPCs.type";

export function constructNPCsPath(worldId: string) {
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
    constructNPCsPath(worldId)
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
  ) as DocumentReference<StoredGMNPCDocument>;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { updatedDate, createdDate, ...restNPC } = npc;
  const newNPC: Partial<NPCDocumentFirestore> = {
    updatedTimestamp: Timestamp.now(),
    ...restNPC,
  };

  if (createdDate) {
    newNPC.createdTimestamp = Timestamp.fromDate(createdDate);
  }

  return newNPC;
}

export function convertFromDatabase(npc: NPCDocumentFirestore): NPCDocument {
  const { updatedTimestamp, createdTimestamp, ...restNPC } = npc;
  return {
    updatedDate: updatedTimestamp.toDate(),
    createdDate: createdTimestamp.toDate(),
    ...restNPC,
  };
}
