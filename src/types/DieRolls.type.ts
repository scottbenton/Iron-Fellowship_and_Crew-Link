import { TRACK_TYPES } from "types/Track.type";

export enum ROLL_RESULT {
  HIT,
  WEAK_HIT,
  MISS,
}

export enum ROLL_TYPE {
  STAT,
  ORACLE_TABLE,
  TRACK_PROGRESS,
}

export interface BaseRoll {
  type: ROLL_TYPE;
  rollLabel: string;
  timestamp: Date;
}
export interface StatRoll extends BaseRoll {
  type: ROLL_TYPE.STAT;
  action: number;
  challenge1: number;
  challenge2: number;
  modifier?: number;
  result: ROLL_RESULT;
}

export interface OracleTableRoll extends BaseRoll {
  type: ROLL_TYPE.ORACLE_TABLE;
  roll: number;
  result: string;
  oracleCategoryName?: string;
}

export interface TrackProgressRoll extends BaseRoll {
  type: ROLL_TYPE.TRACK_PROGRESS;
  challenge1: number;
  challenge2: number;
  trackProgress: number;
  result: ROLL_RESULT;
  trackType: TRACK_TYPES;
}

export type Roll = StatRoll | OracleTableRoll | TrackProgressRoll;
