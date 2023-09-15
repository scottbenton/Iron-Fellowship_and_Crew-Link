import type { Asset as DataforgedAsset } from "dataforged";

export enum AssetType {
  Companion = "Companion",
  Path = "Path",
  CombatTalent = "Combat talent",
  Ritual = "Ritual",
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  inputs?: string[];
  description?: string;
  abilities: {
    name?: string;
    text: string;
    startsEnabled?: boolean;
    alterTrack?: {
      trackName: string;
      max: number;
    };
  }[];
  track?: {
    name: string;
    max: number;
    startingValue?: number;
  };
  multiFieldTrack?: {
    name: string;
    options: string[];
  };
}

export interface StoredAsset {
  id: string;
  enabledAbilities: {
    [index: number]: boolean;
  };
  inputs: {
    [label: string]: string;
  } | null;
  trackValue: number | null;
  customAsset: DataforgedAsset | null;
  order: number;
}

export function getAssetType(assetType?: string): AssetType | undefined {
  switch (assetType?.toLocaleLowerCase()) {
    case "companion":
      return AssetType.Companion;
    case "combat talent":
      return AssetType.CombatTalent;
    case "path":
      return AssetType.Path;
    case "ritual":
      return AssetType.Ritual;
    default:
      return undefined;
  }
}

export const assetTypeToIdMap: { [assetType in AssetType]: string } = {
  [AssetType.Path]: "ironsworn/assets/path",
  [AssetType.CombatTalent]: "ironsworn/assets/combat_talent",
  [AssetType.Companion]: "ironsworn/assets/companion",
  [AssetType.Ritual]: "ironsworn/assets/ritual",
};
