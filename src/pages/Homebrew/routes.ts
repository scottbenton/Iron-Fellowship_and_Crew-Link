import { BASE_ROUTES, basePaths } from "routes";

export enum HOMEBREW_ROUTES {
  SELECT,
  EDITOR,
}

export const homebrewPaths: { [key in HOMEBREW_ROUTES]: string } = {
  [HOMEBREW_ROUTES.SELECT]: "",
  [HOMEBREW_ROUTES.EDITOR]: ":homebrewId",
};

export function constructHomebrewEditorPath(homebrewId: string) {
  return `${basePaths[BASE_ROUTES.CUSTOM_CONTENT]}/${homebrewId}`;
}
