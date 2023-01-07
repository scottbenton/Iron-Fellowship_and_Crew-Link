export enum ROUTES {
  CHARACTER_SELECT,
  CHARACTER_SHEET,
  CHARACTER_CREATE,
  CAMPAIGN_SELECT,
  CAMPAIGN_SHEET,
}

export const paths: { [key in ROUTES]: string } = {
  [ROUTES.CHARACTER_SELECT]: "/characters",
  [ROUTES.CHARACTER_SHEET]: "/characters/:character-id",
  [ROUTES.CHARACTER_CREATE]: "/characters/create",
  [ROUTES.CAMPAIGN_SELECT]: "/campaigns",
  [ROUTES.CAMPAIGN_SHEET]: "/campaigns/:campaign-id",
};
