import { Asset } from "dataforged";
import { Unsubscribe } from "firebase/firestore";
import { StoredAsset } from "types/Asset.type";

export interface SharedAssetSliceData {
  assets: { [key: string]: StoredAsset };
  loading: boolean;
  error?: string;
}

export interface SharedAssetSliceActions {
  subscribe: (campaignId: string) => Unsubscribe;

  addAsset: (asset: StoredAsset) => Promise<void>;
  removeAsset: (assetId: string) => Promise<void>;
  updateAssetInput: (
    assetId: string,
    inputLabel: string,
    inputValue: string
  ) => Promise<void>;
  updateAssetCheckbox: (
    assetId: string,
    abilityIndex: number,
    checked: boolean
  ) => Promise<void>;
  updateAssetTrack: (assetId: string, trackValue: number) => Promise<void>;
  updateCustomAsset: (assetId: string, asset: Asset) => Promise<void>;
  updateAssetCondition: (
    assetId: string,
    condition: string,
    checked: boolean
  ) => Promise<void>;

  resetStore: () => void;
}

export type SharedAssetSlice = SharedAssetSliceData & SharedAssetSliceActions;
