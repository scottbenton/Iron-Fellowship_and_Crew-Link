import { assetTypeToIdMap, AssetType } from "types/Asset.type";

export function encodeDataswornId(id: string) {
  return encodeURIComponent(id);
}

export function decodeDataswornId(id: string) {
  return decodeURIComponent(id);
}

export function generateCustomDataswornId(
  idPrefix: string,
  idContents: string
) {
  return `${idPrefix}/custom/${encodeContents(idContents)}`;
}

export function generateAssetDataswornId(
  assetGroup: AssetType,
  idContents: string
) {
  return `${assetTypeToIdMap[assetGroup]}/${encodeContents(idContents)}`;
}

export function encodeContents(content: string) {
  const sanitizedId = content
    .replaceAll(" ", "_")
    .replaceAll("/", "")
    .toLocaleLowerCase();

  if (!sanitizedId) {
    throw new Error("Failed to generate custom id");
  }

  return sanitizedId;
}
