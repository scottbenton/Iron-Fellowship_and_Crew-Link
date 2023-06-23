import { Bytes, Timestamp } from "firebase/firestore";

export enum NPC_SPECIES {
  IRONLANDER = "ironlander",
  ELF = "elf",
  GIANT = "giant",
  VAROU = "varou",
  TROLL = "troll",
  OTHER = "other",
}

export interface NPCDocument {
  name: string;
  species: NPC_SPECIES;
  lastLocationId?: string;
  imageFilenames?: string[];
  sharedWithPlayers?: boolean;
  updatedDate: Date;
  createdDate: Date;
}

export interface NPCDocumentFirestore
  extends Omit<NPCDocument, "updatedDate" | "createdDate"> {
  updatedTimestamp: Timestamp;
  createdTimestamp: Timestamp;
}

export interface GMNPCDocument {
  goal?: string;
  role?: string;
  descriptor?: string;
  disposition?: string;
  activity?: string;
  notes?: string;
}

export interface NPCNotesDocument {
  notes: Bytes;
}
