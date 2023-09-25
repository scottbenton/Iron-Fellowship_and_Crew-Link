import type { Asset as DataforgedAsset } from "dataforged";

export enum AssetType {
  Companion = "Companion",
  Path = "Path",
  CombatTalent = "Combat talent",
  Ritual = "Ritual",
  Role = "Role",
}

export interface JsonAsset {
  Name: string;
  "Asset Type": string;
  "Input Fields"?: string[];
  Deed?: boolean;
  Description?: string;
  Abilities: {
    Name?: string;
    Text: string;
    Enabled?: boolean;
    "Alter Properties"?: {
      "Asset Track": {
        Name: string;
        Max: number;
      };
    };
  }[];
  "Asset Track"?: {
    Name: string;
    Max: number;
    "Starting Value"?: number;
  };
  MultiFieldAssetTrack?: {
    Fields: {
      Name: string;
      ActiveText: string;
      InactiveText: string;
      IsActive: boolean;
    }[];
  };
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
    case "ironsworn/assets/companion":
      return AssetType.Companion;
    case "ironsworn/assets/combat_talent":
      return AssetType.CombatTalent;
    case "ironsworn/assets/path":
      return AssetType.Path;
    case "ironsworn/assets/ritual":
      return AssetType.Ritual;
    case "ironsworn/assets/role":
      return AssetType.Role;
    default:
      return undefined;
  }
}

export const assetTypeToIdMap: { [assetType in AssetType]: string } = {
  [AssetType.Path]: "ironsworn/assets/path",
  [AssetType.CombatTalent]: "ironsworn/assets/combat_talent",
  [AssetType.Companion]: "ironsworn/assets/companion",
  [AssetType.Ritual]: "ironsworn/assets/ritual",
  [AssetType.Role]: "ironsworn/assets/role",
};
