import { StoredAsset } from "./Asset.type";
import { DEBILITIES } from "./debilities.enum";
import { STATS } from "./stats.enum";

export type StatsMap = {
  [key in STATS]: number;
};

export enum INITIATIVE_STATUS {
  HAS_INITIATIVE = "initiative",
  DOES_NOT_HAVE_INITIATIVE = "noInitiative",
  OUT_OF_COMBAT = "outOfCombat",
}

export interface CharacterDocument {
  name: string;
  stats: StatsMap;
  health: number;
  spirit: number;
  supply: number;
  momentum: number;
  campaignId?: string;
  experience?: {
    earned?: number;
    spent?: number;
  };
  bonds?: number;
  debilities?: {
    [key in DEBILITIES]?: boolean;
  };
  initiativeStatus?: INITIATIVE_STATUS;
  shareNotesWithGM?: boolean;
}

export interface AssetDocument {
  assetOrder: string[];
  assets: {
    [key: string]: StoredAsset;
  };
}
