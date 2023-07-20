import { Box, LinearProgress } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { AUTH_STATE, useAuth } from "../../providers/AuthProvider";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { useEffect, useRef } from "react";
import { useContinueUrl } from "hooks/useContinueUrl";
import {
  BASE_ROUTES,
  basePaths,
  openPaths,
  onlyUnauthenticatedPaths,
} from "routes";

import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { completeMagicLinkSignupIfPresent } from "lib/auth.lib";
import { useSnackbar } from "hooks/useSnackbar";

export interface LayoutProps {}

export function Layout(props: LayoutProps) {
  const { pathname } = useLocation();
  const { state } = useAuth();
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
  }, [pathname, state]);

  useEffect(() => {
    if (previousMagicLinkPathnameChecked.current !== pathname) {
      previousMagicLinkPathnameChecked.current = pathname;
      completeMagicLinkSignupIfPresent().catch((e) => error(e));
    }
  }, [pathname, error]);

  if (state === AUTH_STATE.LOADING) {
    return <LinearProgress color={"secondary"} />;
  }

  return (
    <Box
      minHeight={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      sx={(theme) => ({
        overflowX: "hidden",
        backgroundColor: theme.palette.background.background,
      })}
    >
      <Header />
      <Outlet />
      <Footer />
    </Box>
  );
}
