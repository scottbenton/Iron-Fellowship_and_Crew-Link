import { basePaths } from "routes";
import { BASE_ROUTES } from "routes";

export enum CAMPAIGN_ROUTES {
  SELECT,
  SHEET,
  JOIN,
  GM_SCREEN,
}

export const campaignPaths: { [key in CAMPAIGN_ROUTES]: string } = {
  [CAMPAIGN_ROUTES.SELECT]: "",
  [CAMPAIGN_ROUTES.SHEET]: ":campaignId",
  [CAMPAIGN_ROUTES.JOIN]: ":campaignId/join",
  [CAMPAIGN_ROUTES.GM_SCREEN]: ":campaignId/gm-screen",
};

export function constructCampaignPath(key: CAMPAIGN_ROUTES) {
  if (key !== CAMPAIGN_ROUTES.SELECT) {
    throw new Error("Please use constructCampaignSheetPath function");
  } else {
    return `${basePaths[BASE_ROUTES.CAMPAIGN]}/${campaignPaths[key]}`;
  }
}

export function constructCampaignSheetPath(
  campaignId: string,
  key: CAMPAIGN_ROUTES
) {
  if (key === CAMPAIGN_ROUTES.SELECT) {
    throw new Error("Please use constructCampaignPath function");
  } else {
    return `${basePaths[BASE_ROUTES.CAMPAIGN]}/${campaignPaths[key].replace(
      ":campaignId",
      campaignId
    )}`;
  }
}
