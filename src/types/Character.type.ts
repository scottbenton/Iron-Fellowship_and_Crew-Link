import { StoredAsset } from "./Asset.type";
import { LegacyTrack } from "./LegacyTrack.type";

export type StatsMap = {
  [key: string]: number;
};

export enum INITIATIVE_STATUS {
  HAS_INITIATIVE = "initiative",
  DOES_NOT_HAVE_INITIATIVE = "noInitiative",
  OUT_OF_COMBAT = "outOfCombat",
}

export interface CharacterDocument {
  uid: string;
  name: string;
  stats: StatsMap;
  adds?: number;
  momentum: number;
  campaignId?: string;
  experience?: {
    earned?: number;
    spent?: number;
  };
  debilities?: {
    [key: string]: boolean;
  };
  initiativeStatus?: INITIATIVE_STATUS;
  shareNotesWithGM?: boolean;
  profileImage?: {
    filename: string;
    position: {
      x: number;
      y: number;
    };
    scale: number;
  };
  worldId?: string | null;

  conditionMeters?: Record<string, number>;
  specialTracks?: Record<string, LegacyTrack>;

  // TODO - remove once new expansion is complete
  health: number;
  spirit: number;
  supply: number;
  legacyTracks?: Record<string, LegacyTrack>;
  bonds?: number;
  customTracks?: {
    [trackName: string]: number;
  };
  expansionIds?: string[];
}

export interface AssetDocument {
  assetOrder: string[];
  assets: {
    [key: string]: StoredAsset;
  };
}
