import { SECTOR_HEX_TYPES } from "./Sector.type";

export interface BaseStarforgedLocation {
  name: string;
  type: SECTOR_HEX_TYPES;
  imageFilenames?: string[];
}

export interface StarforgedLocationStar extends BaseStarforgedLocation {
  type: SECTOR_HEX_TYPES.STAR;
  description?: string;
}

export interface StarforgedLocationPlanet extends BaseStarforgedLocation {
  type: SECTOR_HEX_TYPES.PLANET;
  planetClassName?: string;
  subType: string;
  description?: string;
  feature?: string;
  atmosphere?: string;
  settlements?: string;
  life?: string;
  observedFromSpace?: string;
}

export interface StarforgedLocationSettlement extends BaseStarforgedLocation {
  type: SECTOR_HEX_TYPES.SETTLEMENT;
  location?: string;
  firstLook?: string;
  initialContact?: string;
  authority?: string;
  projects?: string;
  trouble?: string;
  population?: string;
}

export interface StarforgedLocationDerelict extends BaseStarforgedLocation {
  type: SECTOR_HEX_TYPES.DERELICT;
  location?: string;
  subType?: string;
  condition?: string;
  outerFirstLook?: string;
  innerFirstLook?: string;
}

export interface StarforgedLocationVault extends BaseStarforgedLocation {
  type: SECTOR_HEX_TYPES.VAULT;
  location?: string;
  scale?: string;
  form?: string;
  shape?: string;
  material?: string;
  outerFirstLook?: string;
  innerFirstLook?: string;
  interiorFeature?: string;
  interiorPeril?: string;
  interiorOpportunity?: string;
  sanctumFeature?: string;
  sanctumPeril?: string;
  sanctumOpportunity?: string;
  sanctumPurpose?: string;
}

export interface StarforgedLocationOther extends BaseStarforgedLocation {
  type: SECTOR_HEX_TYPES.OTHER;
}

export type StarforgedLocation =
  | StarforgedLocationStar
  | StarforgedLocationPlanet
  | StarforgedLocationDerelict
  | StarforgedLocationSettlement
  | StarforgedLocationOther
  | StarforgedLocationVault;
