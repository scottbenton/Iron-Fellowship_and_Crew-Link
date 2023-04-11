export enum ROUTES {
  CHARACTER_SELECT,
  CHARACTER_SHEET,
  CHARACTER_CREATE,
  CAMPAIGN_SELECT,
  CAMPAIGN_SHEET,
  CAMPAIGN_JOIN,
  CAMPAIGN_GM_SCREEN,
  WORLD_SELECT,
  WORLD_CREATE,
  WORLD_SHEET,
  LOGIN,
}

export const CHARACTER_PREFIX = "characters";
export const CAMPAIGN_PREFIX = "campaigns";
export const WORLD_PREFIX = "worlds";

export const paths: { [key in ROUTES]: string } = {
  [ROUTES.CHARACTER_SELECT]: `/${CHARACTER_PREFIX}`,
  [ROUTES.CHARACTER_SHEET]: `/${CHARACTER_PREFIX}/:characterId`,
  [ROUTES.CHARACTER_CREATE]: `/${CHARACTER_PREFIX}/create`,
  [ROUTES.CAMPAIGN_SELECT]: `/${CAMPAIGN_PREFIX}`,
  [ROUTES.CAMPAIGN_SHEET]: `/${CAMPAIGN_PREFIX}/:campaignId`,
  [ROUTES.CAMPAIGN_JOIN]: `/${CAMPAIGN_PREFIX}/:campaignId/join`,
  [ROUTES.CAMPAIGN_GM_SCREEN]: `/${CAMPAIGN_PREFIX}/:campaignId/gm-screen`,
  [ROUTES.WORLD_SELECT]: `/${WORLD_PREFIX}`,
  [ROUTES.WORLD_CREATE]: `/${WORLD_PREFIX}/create`,
  [ROUTES.WORLD_SHEET]: `/${WORLD_PREFIX}/:userId/:worldId`,
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

export function constructCampaignGMScreenUrl(campaignId: string) {
  return `/campaigns/${campaignId}/gm-screen`;
}

export function constructCharacterCreateInCampaignUrl(campaignId: string) {
  return paths[ROUTES.CHARACTER_CREATE] + "?campaignId=" + campaignId;
}

export function constructWorldSheetUrl(userId: string, worldId: string) {
  return `/${WORLD_PREFIX}/${userId}/${worldId}`;
}
