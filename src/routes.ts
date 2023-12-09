export enum BASE_ROUTES {
  CHARACTER,
  CAMPAIGN,
  WORLD,
  LOGIN,
  SIGNUP,
  HOME,
  HOMEBREW,
}

export const CHARACTER_PREFIX = "characters";
export const CAMPAIGN_PREFIX = "campaigns";
export const WORLD_PREFIX = "worlds";
export const HOMEBREW_PREFIX = "homebrew";

export const basePaths: { [key in BASE_ROUTES]: string } = {
  [BASE_ROUTES.CHARACTER]: "/characters",
  [BASE_ROUTES.CAMPAIGN]: "/campaigns",
  [BASE_ROUTES.WORLD]: "/worlds",
  [BASE_ROUTES.HOMEBREW]: "/homebrew",
  [BASE_ROUTES.LOGIN]: "/login",
  [BASE_ROUTES.SIGNUP]: "/join",
  [BASE_ROUTES.HOME]: "/",
};

export const openPaths = [
  basePaths[BASE_ROUTES.LOGIN],
  basePaths[BASE_ROUTES.SIGNUP],
  basePaths[BASE_ROUTES.HOME],
];

export const onlyUnauthenticatedPaths = [
  basePaths[BASE_ROUTES.LOGIN],
  basePaths[BASE_ROUTES.SIGNUP],
];

export function constructRedirectUrlWithContinueParam(
  redirectPath: string,
  continuePath: string
) {
  const params = new URLSearchParams();
  params.append("continue", continuePath);

  return redirectPath + "?" + params.toString();
}
