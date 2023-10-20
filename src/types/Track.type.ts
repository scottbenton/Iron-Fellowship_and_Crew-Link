import { Timestamp } from "firebase/firestore";

export enum TRACK_TYPES {
  VOW = "vow",
  JOURNEY = "journey",
  FRAY = "fray",
  BOND_PROGRESS = "bondProgress",
  CLOCK = "clock",
}

export type PROGRESS_TRACKS =
  | TRACK_TYPES.BOND_PROGRESS
  | TRACK_TYPES.FRAY
  | TRACK_TYPES.JOURNEY
  | TRACK_TYPES.VOW;
export type TRACK_SECTION_PROGRESS_TRACKS =
  | TRACK_TYPES.FRAY
  | TRACK_TYPES.JOURNEY
  | TRACK_TYPES.VOW;
export type TRACK_SECTION_TRACKS =
  | TRACK_SECTION_PROGRESS_TRACKS
  | TRACK_TYPES.CLOCK;

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

export interface BaseTrack {
  label: string;
  type: TRACK_SECTION_TRACKS;
  description?: string;
  value: number;
  status: TRACK_STATUS;
  createdDate: Date;
}

export interface BaseTrackDocument extends Omit<BaseTrack, "createdDate"> {
  createdTimestamp: Timestamp;
}

export interface ProgressTrack extends BaseTrack {
  difficulty: DIFFICULTY;
}
export interface ProgressTrackDocument
  extends Omit<ProgressTrack, "createdDate"> {
  createdTimestamp: Timestamp;
}

export interface Clock extends BaseTrack {
  segments: number;
}
export interface ClockDocument extends Omit<Clock, "createdDate"> {
  createdTimestamp: Timestamp;
}

export type TrackDocument = ProgressTrackDocument | ClockDocument;
export type Track = ProgressTrack | Clock;
