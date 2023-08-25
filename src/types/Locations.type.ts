import { Bytes, Timestamp } from "firebase/firestore";

export interface StoredLocation {
  name: string;
  sharedWithPlayers?: boolean;
  updatedTimestamp: Timestamp;
  createdTimestamp: Timestamp;
  imageFilenames?: string[];
}

export interface LocationDocument
  extends Omit<StoredLocation, "updatedTimestamp" | "createdTimestamp"> {
  updatedDate: Date;
  createdDate: Date;
}

export interface StoredGMLocationDocument {
  descriptor?: string;
  trouble?: string;
  locationFeatures?: string;
  gmNotes?: Bytes;
}
export interface GMLocationDocument
  extends Omit<StoredGMLocationDocument, "gmNotes"> {
  gmNotes?: Uint8Array;
}

export interface LocationNotesDocument {
  notes: Bytes;
}
