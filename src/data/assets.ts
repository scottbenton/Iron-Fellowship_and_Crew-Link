import { ironswornAssetCategories } from "./dataforged";
import type { Asset as DataforgedAsset } from "dataforged";

// NEW ASSETS START HERE
export const assetMap: { [key: string]: DataforgedAsset } = {};
export const assetTypeLabels: { [key: string]: string } = {};

Object.values(ironswornAssetCategories).forEach((category) => {
  assetTypeLabels[category.$id] = category.Title.Standard;
  Object.values(category.Assets).forEach((asset) => {
    assetMap[asset.$id] = asset;
  });
});

export const assetGroups = Object.values(ironswornAssetCategories);
assetGroups.map((group) => console.debug(group.$id));
