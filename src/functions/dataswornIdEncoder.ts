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

const defaultRegex = new RegExp(/^([a-z0-9_]{3,})$/);
const defaultReplaceRegex = new RegExp(/[^a-z0-9_]/g);
export function convertIdPart(
  idPart: string,
  config?: {
    testRegex?: RegExp;
    replaceRegex?: RegExp;
    replaceNumbers?: boolean;
  }
) {
  const {
    testRegex = defaultRegex,
    replaceRegex = defaultReplaceRegex,
    replaceNumbers,
  } = config ?? {};

  let newIdPart = idPart.toLocaleLowerCase().replaceAll(" ", "_");

  if (replaceNumbers) {
    newIdPart = newIdPart
      .replaceAll("0", "zero")
      .replaceAll("1", "one")
      .replaceAll("2", "two")
      .replaceAll("3", "three")
      .replaceAll("4", "four")
      .replaceAll("5", "five")
      .replaceAll("6", "six")
      .replaceAll("7", "seven")
      .replaceAll("8", "eight")
      .replaceAll("9", "nine");
  }

  newIdPart = newIdPart.replace(replaceRegex, "");

  if (newIdPart.match(testRegex)) {
    return newIdPart;
  }

  throw new Error(
    `Failed to create valid ID: ID Part = ${idPart}, New ID Part = ${newIdPart}`
  );
}
