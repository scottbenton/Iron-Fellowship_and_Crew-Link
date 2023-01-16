import { StoredAsset } from "./Asset.type";
import { STATS } from "./stats.enum";

export type StatsMap = {
  [key in STATS]: number;
};

export interface CharacterDocument {
  name: string;
  stats: StatsMap;
  health: number;
  spirit: number;
  supply: number;
  momentum: number;
}

export interface AssetDocument {
  assetOrder: string[];
  assets: {
    [key: string]: StoredAsset;
  };
}
