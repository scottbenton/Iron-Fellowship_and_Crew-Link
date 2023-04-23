import { Timestamp } from "firebase/firestore";

export interface StoredLocation {
  name: string;
  hiddenFromPlayers?: boolean;
  updatedTimestamp: Timestamp;
}

export interface LocationDocument {
  name: string;
  hiddenFromPlayers?: boolean;
  updatedDate: Date;
}

export interface GMLocationDocument {
  descriptor?: string;
  trouble?: string;
  locationFeatures?: string;
  notes?: string;
}
