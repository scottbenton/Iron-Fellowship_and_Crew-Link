import { Timestamp } from "firebase/firestore";

export enum SECTOR_HEX_TYPES {
  PLANET = "planet",
  STAR = "star",
  VAULT = "vault",
  SETTLEMENT = "settlement",
  DERELICT = "derelict",
  // SHIP = "ship",
  // CREATURE = "creature",
  OTHER = "other",
  PATH = "path",
}

export enum REGIONS {
  TERMINUS = "Terminus",
  OUTLANDS = "Outlands",
  EXPANSE = "Expanse",
  VOID = "Void",
}

export interface SectorMapEntry {
  type: SECTOR_HEX_TYPES;
  locationId?: string;
}

export interface SectorMap {
  [row: number]: {
    [col: number]: SectorMapEntry;
  };
}

export interface Sector {
  name: string;
  sharedWithPlayers: boolean;
  region?: string;
  trouble?: string;
  map: SectorMap;
  createdDate: Date;
}

export interface StoredSector extends Omit<Sector, "createdDate"> {
  createdTimestamp: Timestamp;
}
