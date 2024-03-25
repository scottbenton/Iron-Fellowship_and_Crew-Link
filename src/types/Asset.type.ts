import type { Asset as DataforgedAsset } from "dataforged";

export interface StoredAsset {
  id: string;
  enabledAbilities: Record<number, boolean>;
  optionValues?: Record<string, string>;
  controlValues?: Record<string, boolean | string | number>;
  order: number;

  // TODO - Remove when assets are updated
  customAsset?: DataforgedAsset | null;
  conditions?: Record<string, boolean>;
  inputs?: Record<string, string> | null;
  trackValue?: number | null;
}

export interface StoredHomebrewAssetCollection {
  collectionId: string; // Homebrew collection id
  label: string;
  enhances?: string;
  replaces?: string;
}

export interface StoredHomebrewAsset {
  collectionId: string; // Homebrew collection id
  categoryKey: string;

  label: string;
  requirement?: string;
  shared?: boolean;

  // controls?:
  // options?:
  abilities: [];

  enhances?: string;
  replaces?: string;
}
