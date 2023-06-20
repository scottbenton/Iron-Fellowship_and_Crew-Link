import { Bytes, Timestamp } from "firebase/firestore";

export interface StoredLocation {
  name: string;
  sharedWithPlayers?: boolean;
  updatedTimestamp: Timestamp;
  imageFilenames?: string[];
}

export interface LocationDocument {
  name: string;
  sharedWithPlayers?: boolean;
  updatedDate: Date;
  imageFilenames?: string[];
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
