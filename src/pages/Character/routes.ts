import { BASE_ROUTES, basePaths } from "routes";

export enum CHARACTER_ROUTES {
  CREATE,
  SHEET,
  SELECT,
  CARD,
}

export const characterPaths: { [key in CHARACTER_ROUTES]: string } = {
  [CHARACTER_ROUTES.CREATE]: "create",
  [CHARACTER_ROUTES.SHEET]: ":characterId",
  [CHARACTER_ROUTES.CARD]: ":userId/:characterId/card",
  [CHARACTER_ROUTES.SELECT]: "",
};

export function constructCharacterPath(key: CHARACTER_ROUTES) {
  if (key === CHARACTER_ROUTES.SHEET) {
    throw new Error("Please use constructCharacterSheetPath function");
  } else {
    return `${basePaths[BASE_ROUTES.CHARACTER]}/${characterPaths[key]}`;
  }
}

export function constructCharacterSheetPath(characterId: string) {
  return `${basePaths[BASE_ROUTES.CHARACTER]}/${characterId}`;
}

export function constructCharacterCreateInCampaignUrl(campaignId: string) {
  return `${basePaths[BASE_ROUTES.CHARACTER]}/${
    characterPaths[CHARACTER_ROUTES.CREATE]
  }?campaignId=${campaignId}`;
}

export function constructCharacterCardUrl(uid: string, characterId: string) {
  return `${basePaths[BASE_ROUTES.CHARACTER]}/${uid}/${characterId}/card`;
}
