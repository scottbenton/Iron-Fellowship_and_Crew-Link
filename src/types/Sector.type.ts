import { Timestamp } from "firebase/firestore";

export enum SECTOR_HEX_TYPES {
  PLANET = "planet",
  STAR = "star",
  VAULT = "vault",
  SETTLEMENT = "settlement",
  DERELICT = "derelict",
  SHIP = "ship",
  CREATURE = "creature",
  OTHER = "other",
  PATH = "path",
}

export enum REGIONS {
  TERMINUS = "Terminus",
  OUTLANDS = "Outlands",
  EXPANSE = "Expanse",
  VOID = "Void",
}

export interface SectorMap {
  [row: number]: {
    [col: number]: {
      type: SECTOR_HEX_TYPES | undefined;
    };
  };
}

export interface Sector {
  name: string;
  sharedWithPlayers: boolean;
  region?: string;
  map: SectorMap;
  createdDate: Date;
}

export interface StoredSector extends Omit<Sector, "createdDate"> {
  createdTimestamp: Timestamp;
}
