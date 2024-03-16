import { getSystem } from "hooks/useGameSystem";
import {
  ironswornAssetCategories,
  starforgedAssetCategories,
} from "./dataforged";
import type {
  AssetType,
  ConditionMeter,
  Asset as DataforgedAsset,
} from "dataforged";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";

import ironswornRules from "@datasworn/ironsworn-classic/json/classic.json";
import starforgedRules from "@datasworn/starforged/json/starforged.json";
import { Datasworn } from "@datasworn/core";
import { parseAssetsIntoMaps } from "stores/rules/helpers/parseAssetsIntoMaps";

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

const oldIronswornAssets: Record<string, DataforgedAsset> = {};

Object.values(ironswornAssetCategories).forEach((category) => {
  assetTypeLabels[category.$id] = category.Title.Standard;
  Object.values(category.Assets).forEach((asset) => {
    oldIronswornAssets[asset.$id] = asset;
  });
});

const newIronswornAssets: Record<string, Datasworn.Asset> = parseAssetsIntoMaps(
  (ironswornRules as Datasworn.Ruleset).assets
).assetMap;

const oldStarforgedAssets: Record<string, DataforgedAsset> = {};
Object.values(starforgedAssetCategories).forEach((category) => {
  assetTypeLabels[category.$id] = category.Title.Standard;
  Object.values(category.Assets).forEach((asset) => {
    oldStarforgedAssets[asset.$id] = asset;
  });
});

function getNewDataswornId(oldId: string): string {
  return oldId.replace("ironsworn", "classic").replaceAll("-", "_");
}
function getNewConditionMeterKey(conditionMeter: ConditionMeter) {
  return conditionMeter.Label.replace("companion health", "health");
}

const newStarforgedAssets: Record<string, Datasworn.Asset> =
  parseAssetsIntoMaps((starforgedRules as Datasworn.Ruleset).assets).assetMap;

const compareAssets = (
  oldAssets: Record<string, DataforgedAsset>,
  newAssets: Record<string, Datasworn.Asset>
) => {
  Object.keys(oldAssets).forEach((oldAssetKey) => {
    const newAssetKey = getNewDataswornId(oldAssetKey);
    if (!newAssets[newAssetKey]) {
      // console.debug("Missing asset", oldAssetKey);
      return;
    }
    const oldAsset = oldAssets[oldAssetKey];
    const newAsset = newAssets[newAssetKey];

    if (oldAsset["Condition meter"]) {
      const newControls = newAsset.controls;
      if (!newControls) {
        console.debug("NEW ASSET DOES NOT HAVE CONTROLS");
      } else {
        const newConditionMeterKey = getNewConditionMeterKey(
          oldAsset["Condition meter"]
        );

        if (
          !newControls[newConditionMeterKey] ||
          newControls[newConditionMeterKey].field_type !== "condition_meter"
        ) {
          console.debug("NEW ASSET DOES NOT HAVE CONDITION METER");
        }
      }
    }
  });
};

console.debug("COMPARING IRONSWORN ASSETS");
compareAssets(oldIronswornAssets, newIronswornAssets);
console.debug("COMPARING STARFORGED ASSETS");
compareAssets(oldStarforgedAssets, newStarforgedAssets);

// Asset Diff
/**
starforged/assets/path/crew_commander
starforged/assets/companion/the_kraken
starforged/assets/deed/cohort 
starforged/assets/deed/fleet_commander
 */
