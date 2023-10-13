import { Bytes, Timestamp } from "firebase/firestore";
import { DIFFICULTY } from "./Track.type";

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
  pronouns?: string;
  species?: NPC_SPECIES; // Ironsworn only
  lastLocationId?: string; // Ironsworn only
  lastSectorId?: string; // Starforged only
  imageFilenames?: string[];
  sharedWithPlayers?: boolean;
  characterConnections?: { [characterId: string]: boolean }; // Starforged only
  characterBonds?: { [characterId: string]: boolean };
  characterBondProgress?: { [characterId: string]: number }; // Starforged only

  rank?: DIFFICULTY; // Starforged only
  callsign?: string; // Starforged only

  updatedDate: Date;
  createdDate: Date;
}

export interface NPCDocumentFirestore
  extends Omit<NPCDocument, "updatedDate" | "createdDate"> {
  updatedTimestamp: Timestamp;
  createdTimestamp: Timestamp;
}

export interface StoredGMNPCDocument {
  goal?: string;
  role?: string;
  descriptor?: string; // Ironsworn only
  disposition?: string;
  activity?: string; // Ironsworn only
  gmNotes?: Bytes;

  firstLook?: string; // Starforged only
  revealedAspect?: string; // Starforged only
}
export interface GMNPCDocument extends Omit<StoredGMNPCDocument, "gmNotes"> {
  gmNotes?: Uint8Array;
}

export interface NPCNotesDocument {
  notes: Bytes;
}
