import { useContinueUrl } from "hooks/useContinueUrl";
import { sendPageViewEvent } from "lib/analytics.lib";
import { completeMagicLinkSignupIfPresent } from "lib/auth.lib";
import { useSnackbar } from "providers/SnackbarProvider";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  BASE_ROUTES,
  basePaths,
  onlyUnauthenticatedPaths,
  openPaths,
} from "routes";
import { AUTH_STATE } from "stores/auth/auth.slice.type";
import { useStore } from "stores/store";

export function LayoutPathListener() {
  const { pathname } = useLocation();
  const state = useStore((store) => store.auth.status);
  const { error } = useSnackbar();

  const previousMagicLinkPathnameChecked = useRef<string>();
  const { redirectWithContinueUrl, navigateToContinueURL } = useContinueUrl();

  useEffect(() => {
    if (!openPaths.includes(pathname) && state === AUTH_STATE.UNAUTHENTICATED) {
      redirectWithContinueUrl(basePaths[BASE_ROUTES.LOGIN], pathname);
    } else if (
      onlyUnauthenticatedPaths.includes(pathname) &&
      state === AUTH_STATE.AUTHENTICATED
    ) {
      navigateToContinueURL(basePaths[BASE_ROUTES.CHARACTER]);
    }
  }, [pathname, state, navigateToContinueURL, redirectWithContinueUrl]);

  useEffect(() => {
    sendPageViewEvent();
  }, [pathname]);

  useEffect(() => {
    if (previousMagicLinkPathnameChecked.current !== pathname) {
      previousMagicLinkPathnameChecked.current = pathname;
      completeMagicLinkSignupIfPresent().catch((e) => error(e));
    }
  }, [pathname, error]);

  return null;
}
