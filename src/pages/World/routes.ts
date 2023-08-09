import { BASE_ROUTES, basePaths } from "routes";

export enum WORLD_ROUTES {
  SELECT,
  CREATE,
  SHEET,
}

export const worldPaths: { [key in WORLD_ROUTES]: string } = {
  [WORLD_ROUTES.SELECT]: "",
  [WORLD_ROUTES.CREATE]: "create",
  [WORLD_ROUTES.SHEET]: ":worldId",
};

export function constructWorldPath(key: WORLD_ROUTES) {
  if (key === WORLD_ROUTES.SHEET) {
    throw new Error(
      "For world sheets, please use constructWorldSheetPath instead."
    );
  }
  return `${basePaths[BASE_ROUTES.WORLD]}/${worldPaths[key]}`;
}

export function constructWorldSheetPath(worldId: string) {
  return `${basePaths[BASE_ROUTES.WORLD]}/${worldId}`;
}
