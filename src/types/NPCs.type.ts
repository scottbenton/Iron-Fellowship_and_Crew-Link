import { Bytes, Timestamp } from "firebase/firestore";

export enum NPC_SPECIES {
  IRONLANDER,
  ELF,
  GIANT,
  VAROU,
  TROLL,
}

export interface NPCDocument {
  species?: NPC_SPECIES;
  name: string;
  lastLocationId?: string;
  imageFilename?: string;
  updatedDate: Date;
}

export interface NPCDocumentFirestore extends Omit<NPCDocument, "updatedDate"> {
  updatedTimestamp: Timestamp;
}

export interface GMNPCDocument {
  goal?: string;
  role?: string;
  descriptor?: string;
  disposition?: string;
  conversation?: string;
  knowledge?: string;
  notes?: string;
}

export interface NPCNotesDocument {
  notes: Bytes;
}
