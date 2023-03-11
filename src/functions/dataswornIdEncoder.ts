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
  const sanitizedId = idContents.replaceAll(" ", "_").replaceAll("/", "");

  if (!sanitizedId) {
    throw new Error("Failed to generate custom id");
  }

  return `${idPrefix}/custom/${sanitizedId}`;
}
