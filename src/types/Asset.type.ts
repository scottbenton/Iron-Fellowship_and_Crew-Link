export enum ASSET_TYPES {
  COMPANION = "Companion",
  PATH = "Path",
  COMBAT_TALENT = "Combat Talent",
  RITUAL = "Ritual",
}

export interface Asset {
  Name: string;
  "Asset Type": ASSET_TYPES;
  "Input Fields"?: string[];
  Deed?: boolean;
  Description?: string;
  Abilities: {
    Name?: string;
    Text: string;
    Enabled?: boolean;
    "Alter Properties"?: {
      "Asset Track"?: {
        Name: string;
        Max: number;
      };
    };
  }[];
  "Asset Track"?: {
    Name: string;
    Max: number;
    "Starting Value": number;
  };
  MultiFieldAssetTrack?: {
    Fields: {
      Name: string;
      ActiveText: string;
      InactiveText: string;
      IsActive: boolean;
    };
  };
}
