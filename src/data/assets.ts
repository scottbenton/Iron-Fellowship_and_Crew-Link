import { getSystem } from "hooks/useGameSystem";
import {
  ironswornAssetCategories,
  starforgedAssetCategories,
} from "./dataforged";
import type { AssetType, Asset as DataforgedAsset } from "dataforged";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";

const gameSystem = getSystem();
const assetCategories: GameSystemChooser<typeof ironswornAssetCategories> = {
  [GAME_SYSTEMS.IRONSWORN]: ironswornAssetCategories,
  [GAME_SYSTEMS.STARFORGED]: starforgedAssetCategories,
};

// NEW ASSETS START HERE
export const assetGroupMap: { [key: string]: AssetType } = {};
export const assetMap: { [key: string]: DataforgedAsset } = {};
export const assetTypeLabels: { [key: string]: string } = {
  "ironsworn/assets/role": "Role",
  "starforged/assets/role": "Role",
};

Object.values(assetCategories[gameSystem]).forEach((category) => {
  assetGroupMap[category.$id] = category;
  assetTypeLabels[category.$id] = category.Title.Standard;
  Object.values(category.Assets).forEach((asset) => {
    assetMap[asset.$id] = asset;
  });
});

export const assetGroups = Object.values(assetCategories[gameSystem]);
