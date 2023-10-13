import { Timestamp } from "firebase/firestore";

export enum TRACK_TYPES {
  VOW = "vow",
  JOURNEY = "journey",
  FRAY = "fray",
  BOND_PROGRESS = "bondProgress",
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
  createdTimestamp: Timestamp;
}

export type TrackWithId = StoredTrack & { id: string };

export type TracksDocument = {
  [key in TRACK_TYPES]?: { [id: string]: StoredTrack };
};
