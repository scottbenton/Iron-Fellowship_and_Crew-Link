import { Bytes, Timestamp } from "firebase/firestore";

export interface LoreDocument {
  name: string;
  imageFilenames?: string[];
  sharedWithPlayers?: boolean;
  tags?: string[];
  updatedDate: Date;
  createdDate: Date;
}

export interface LoreDocumentFirestore
  extends Omit<LoreDocument, "updatedDate" | "createdDate"> {
  updatedTimestamp: Timestamp;
  createdTimestamp: Timestamp;
}

export interface StoredGMLoreDocument {
  gmNotes?: Bytes;
}
export interface GMLoreDocument {
  gmNotes?: Uint8Array;
}

export interface LoreNotesDocument {
  notes: Bytes;
}
