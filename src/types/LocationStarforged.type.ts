import { SECTOR_HEX_TYPES } from "./Sector.type";

export interface BaseStarforgedLocation {
  name: string;
  type: SECTOR_HEX_TYPES;
  imageFilenames?: string[];

  updatedDate: Date;
  createdDate: Date;
}

export interface StarforgedLocationStar extends BaseStarforgedLocation {
  type: SECTOR_HEX_TYPES.STAR;
  description?: string;
}

export interface StarforgedLocationPlanet extends BaseStarforgedLocation {
  type: SECTOR_HEX_TYPES.PLANET;
  planetType?: string;
  description?: string;
  atmosphere?: string;
  settlements?: string;
  life?: string;
  observedFromSpace?: string;
}

export type StarforgedLocation =
  | StarforgedLocationStar
  | StarforgedLocationPlanet;
