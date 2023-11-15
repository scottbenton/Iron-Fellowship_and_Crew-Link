import { Box, LinearProgress } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
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
import { completeMagicLinkSignupIfPresent } from "lib/auth.lib";
import { useSnackbar } from "providers/SnackbarProvider/useSnackbar";
import { sendPageViewEvent } from "lib/analytics.lib";
import { UserNameDialog } from "components/shared/UserNameDialog";
import { useStore } from "stores/store";
import { AUTH_STATE } from "stores/auth/auth.slice.type";
import { SkipToContentButton } from "./SkipToContentButton";

export interface LayoutProps {}

export function Layout(props: LayoutProps) {
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
  }, [pathname, state]);

  useEffect(() => {
    sendPageViewEvent();
  }, [pathname]);

  useEffect(() => {
    if (previousMagicLinkPathnameChecked.current !== pathname) {
      previousMagicLinkPathnameChecked.current = pathname;
      completeMagicLinkSignupIfPresent().catch((e) => error(e));
    }
  }, [pathname, error]);

  const userNameDialogOpen = useStore((store) => store.auth.userNameDialogOpen);
  const closeUserNameDialog = useStore(
    (store) => store.auth.closeUserNameDialog
  );

  if (state === AUTH_STATE.LOADING) {
    return <LinearProgress color={"primary"} />;
  }

  return (
    <Box
      minHeight={"100vh"}
      display={"flex"}
      flexDirection={"column"}
      sx={(theme) => ({
        overflowX: "hidden",
        backgroundColor: theme.palette.background.default,
      })}
    >
      <Box display={"flex"} flexDirection={"column"}>
        <SkipToContentButton />
        <Header />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
          component={"main"}
          id={"main-content"}
        >
          <Outlet />
        </Box>
      </Box>
      <Footer />
      <UserNameDialog
        open={userNameDialogOpen}
        handleClose={closeUserNameDialog}
      />
    </Box>
  );
}
