import type { Asset as DataforgedAsset } from "dataforged";

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
  conditions?: { [key: string]: boolean };
}
