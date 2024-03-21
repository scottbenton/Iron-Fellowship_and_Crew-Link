import { Datasworn } from "@datasworn/core";
import { RulesSliceData } from "../rules.slice.type";

export function parseAssetsIntoMaps(
  assetCategories: Record<string, Datasworn.AssetCollection>
): RulesSliceData["assetMaps"] {
  const assetCollectionMap: Record<string, Datasworn.AssetCollection> = {};
  const assetMap: Record<string, Datasworn.Asset> = {};

  Object.values(assetCategories).forEach((category) => {
    if (category.contents) {
      if (category.replaces) {
        assetCollectionMap[category.replaces] = category;
      }
      assetCollectionMap[category._id] = category;
      Object.values(category.contents ?? {}).forEach((asset) => {
        assetMap[asset._id] = asset;
      });
    }
  });

  return {
    assetCollectionMap,
    assetMap,
  };
}
