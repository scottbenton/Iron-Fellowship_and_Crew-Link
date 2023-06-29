export enum BASE_ROUTES {
  CHARACTER,
  CAMPAIGN,
  WORLD,
  LOGIN,
}

export const CHARACTER_PREFIX = "characters";
export const CAMPAIGN_PREFIX = "campaigns";
export const WORLD_PREFIX = "worlds";

export const basePaths: { [key in BASE_ROUTES]: string } = {
  [BASE_ROUTES.CHARACTER]: "/characters",
  [BASE_ROUTES.CAMPAIGN]: "/campaigns",
  [BASE_ROUTES.WORLD]: "/worlds",
  [BASE_ROUTES.LOGIN]: "/login",
};

export function constructRedirectUrlWithContinueParam(
  redirectPath: string,
  continuePath: string
) {
  const params = new URLSearchParams();
  params.append("continue", continuePath);

  return redirectPath + "?" + params.toString();
}
