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

export interface GMLocationDocument {
  descriptor?: string;
  trouble?: string;
  locationFeatures?: string;
  notes?: string;
}

export interface LocationNotesDocument {
  notes: Bytes;
}
