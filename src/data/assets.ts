import { Asset, ASSET_TYPES, JsonAsset } from "../types/Asset.type";
import jsonAssets from "./assets.json";

export const assets: { [key: string]: Asset } = {};

export const companions: Asset[] = [];
export const paths: Asset[] = [];
export const combatTalents: Asset[] = [];
export const rituals: Asset[] = [];

jsonAssets.Assets.forEach((jsonAsset: JsonAsset) => {
  const asset = convertJsonAssetToAsset(jsonAsset);

  assets[asset.id] = asset;

  switch (asset.type) {
    case ASSET_TYPES.COMPANION:
      companions.push(asset);
      break;
    case ASSET_TYPES.PATH:
      paths.push(asset);
      break;
    case ASSET_TYPES.COMBAT_TALENT:
      combatTalents.push(asset);
      break;
    case ASSET_TYPES.RITUAL:
      rituals.push(asset);
      break;
  }
});

function convertJsonAssetToAsset(asset: JsonAsset): Asset {
  let assetType: ASSET_TYPES;

  switch (asset["Asset Type"]) {
    case "Companion":
      assetType = ASSET_TYPES.COMPANION;
      break;
    case "Path":
      assetType = ASSET_TYPES.PATH;
      break;
    case "Combat Talent":
      assetType = ASSET_TYPES.COMBAT_TALENT;
      break;
    default:
      assetType = ASSET_TYPES.RITUAL;
      break;
  }

  const assetAbilities: Asset["abilities"] = asset.Abilities.map((ability) => ({
    name: ability.Name,
    text: ability.Text,
    startsEnabled: ability.Enabled,
    alterTrack: ability["Alter Properties"]
      ? {
          trackName: ability["Alter Properties"]["Asset Track"].Name,
          max: ability["Alter Properties"]["Asset Track"].Max,
        }
      : undefined,
  }));

  const assetTrack: Asset["track"] | undefined = asset["Asset Track"]
    ? {
        name: asset["Asset Track"].Name,
        max: asset["Asset Track"].Max,
        startingValue: asset["Asset Track"]["Starting Value"],
      }
    : undefined;

  const multiFieldAssetTrack: Asset["multiFieldTrack"] = asset[
    "MultiFieldAssetTrack"
  ]
    ? {
        name: asset["MultiFieldAssetTrack"].Fields[0].Name,
        options: asset["MultiFieldAssetTrack"].Fields.map(
          (field) => field.ActiveText
        ),
      }
    : undefined;

  const id = `${assetType}-${asset.Name}`
    .toLocaleLowerCase()
    .replaceAll(" ", "-");

  return {
    id,
    name: asset.Name,
    type: assetType,
    inputs: asset["Input Fields"],
    deed: asset.Deed,
    description: asset.Description,
    abilities: assetAbilities,
    track: assetTrack,
    multiFieldTrack: multiFieldAssetTrack,
  };
}
