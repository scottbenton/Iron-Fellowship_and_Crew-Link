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

export enum CLOCK_ORACLES_KEYS {
  ALMOST_CERTAIN = "almost_certain",
  LIKELY = "likely",
  FIFTY_FIFTY = "fifty_fifty",
  UNLIKELY = "unlikely",
  SMALL_CHANCE = "small_chance",
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
  oracleKey?: CLOCK_ORACLES_KEYS;
}
export interface ClockDocument extends Omit<Clock, "createdDate"> {
  createdTimestamp: Timestamp;
}

export type TrackDocument = ProgressTrackDocument | ClockDocument;
export type Track = ProgressTrack | Clock;
