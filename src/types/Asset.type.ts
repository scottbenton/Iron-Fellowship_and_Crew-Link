export enum ASSET_TYPES {
  COMPANION = "Companion",
  PATH = "Path",
  COMBAT_TALENT = "Combat Talent",
  RITUAL = "Ritual",
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
  type: ASSET_TYPES;
  inputs?: string[];
  deed?: boolean;
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
  inputs?: {
    [label: string]: string;
  };
  trackValue?: number;
  multiFieldTrackValue?: string;
  customAsset?: Asset;
}
