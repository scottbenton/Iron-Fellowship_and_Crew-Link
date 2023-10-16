import { Timestamp } from "firebase/firestore";

export enum TRACK_TYPES {
  VOW = "vow",
  JOURNEY = "journey",
  FRAY = "fray",
  BOND_PROGRESS = "bondProgress",
}

export enum TRACK_STATUS {
  ACTIVE = "active",
  COMPLETED = "completed",
}

export enum DIFFICULTY {
  TROUBLESOME = "troublesome",
  DANGEROUS = "dangerous",
  FORMIDABLE = "formidable",
  EXTREME = "extreme",
  EPIC = "epic",
}

export interface StoredTrack {
  label: string;
  description?: string;
  difficulty: DIFFICULTY;
  value: number;
  status: TRACK_STATUS;
  createdTimestamp: Timestamp;
  type: TRACK_TYPES;
}

export interface Track extends Omit<StoredTrack, "createdTimestamp"> {
  createdDate: Date;
}
