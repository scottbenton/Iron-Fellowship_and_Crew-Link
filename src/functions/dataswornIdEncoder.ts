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
  assetGroupId: string,
  idContents: string
) {
  return `${assetGroupId}/${encodeContents(idContents)}`;
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
