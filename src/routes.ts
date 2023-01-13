export enum ROUTES {
  CHARACTER_SELECT,
  CHARACTER_SHEET,
  CHARACTER_CREATE,
  CAMPAIGN_SELECT,
  CAMPAIGN_SHEET,
  LOGIN,
}

export const paths: { [key in ROUTES]: string } = {
  [ROUTES.CHARACTER_SELECT]: "/characters",
  [ROUTES.CHARACTER_SHEET]: "/characters/:characterId",
  [ROUTES.CHARACTER_CREATE]: "/characters/create",
  [ROUTES.CAMPAIGN_SELECT]: "/campaigns",
  [ROUTES.CAMPAIGN_SHEET]: "/campaigns/:campaignId",
  [ROUTES.LOGIN]: "/login",
};

export function constructCharacterSheetUrl(characterId: string) {
  return `/characters/${characterId}`;
}
