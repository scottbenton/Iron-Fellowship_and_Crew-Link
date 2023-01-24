export enum ROUTES {
  CHARACTER_SELECT,
  CHARACTER_SHEET,
  CHARACTER_CREATE,
  CAMPAIGN_SELECT,
  CAMPAIGN_SHEET,
  CAMPAIGN_JOIN,
  LOGIN,
}

export const CHARACTER_PREFIX = "characters";
export const CAMPAIGN_PREFIX = "campaigns";

export const paths: { [key in ROUTES]: string } = {
  [ROUTES.CHARACTER_SELECT]: `/${CHARACTER_PREFIX}`,
  [ROUTES.CHARACTER_SHEET]: `/${CHARACTER_PREFIX}/:characterId`,
  [ROUTES.CHARACTER_CREATE]: `/${CHARACTER_PREFIX}/create`,
  [ROUTES.CAMPAIGN_SELECT]: `/${CAMPAIGN_PREFIX}`,
  [ROUTES.CAMPAIGN_SHEET]: `/${CAMPAIGN_PREFIX}/:campaignId`,
  [ROUTES.CAMPAIGN_JOIN]: `/${CAMPAIGN_PREFIX}/:campaignId/join`,
  [ROUTES.LOGIN]: `/login`,
};

export function constructCharacterSheetUrl(characterId: string) {
  return `/characters/${characterId}`;
}

export function constructCampaignSheetUrl(campaignId: string) {
  return `/campaigns/${campaignId}`;
}

export function constructCampaignJoinUrl(campaignId: string) {
  return `/campaigns/${campaignId}/join`;
}

export function constructCharacterCreateInCampaignUrl(campaignId: string) {
  return paths[ROUTES.CHARACTER_CREATE] + "?campaignId=" + campaignId;
}
