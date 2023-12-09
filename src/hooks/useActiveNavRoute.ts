import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  BASE_ROUTES,
  CAMPAIGN_PREFIX,
  CHARACTER_PREFIX,
  HOMEBREW_PREFIX,
  WORLD_PREFIX,
  basePaths,
} from "routes";

export enum NAV_ROUTES {
  CHARACTER = "character",
  CAMPAIGN = "campaign",
  WORLD = "world",
  HOMEBREW = "homebrew",
  LOGIN = "login",
  SIGNUP = "signup",
}
export function useActiveNavRoute() {
  const { pathname } = useLocation();

  const [selectedRoute, setSelectedRoute] = useState<NAV_ROUTES | undefined>(
    NAV_ROUTES.CHARACTER
  );

  useEffect(() => {
    if (pathname.includes(CHARACTER_PREFIX)) {
      setSelectedRoute(NAV_ROUTES.CHARACTER);
    } else if (pathname.includes(CAMPAIGN_PREFIX)) {
      setSelectedRoute(NAV_ROUTES.CAMPAIGN);
    } else if (pathname.includes(WORLD_PREFIX)) {
      setSelectedRoute(NAV_ROUTES.WORLD);
    } else if (pathname.includes(HOMEBREW_PREFIX)) {
      setSelectedRoute(NAV_ROUTES.HOMEBREW);
    } else if (pathname === basePaths[BASE_ROUTES.LOGIN]) {
      setSelectedRoute(NAV_ROUTES.LOGIN);
    } else if (pathname === basePaths[BASE_ROUTES.SIGNUP]) {
      setSelectedRoute(NAV_ROUTES.SIGNUP);
    } else {
      setSelectedRoute(undefined);
    }
  }, [pathname]);

  return selectedRoute;
}
