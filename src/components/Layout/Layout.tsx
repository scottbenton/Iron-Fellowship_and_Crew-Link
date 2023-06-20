import { Box, LinearProgress } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { AUTH_STATE, useAuth } from "../../providers/AuthProvider";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { useEffect } from "react";
import { useContinueUrl } from "hooks/useContinueUrl";
import { BASE_ROUTES, basePaths } from "routes";

export interface LayoutProps {}

export function Layout(props: LayoutProps) {
  const { pathname } = useLocation();
  const { state } = useAuth();

  const { redirectWithContinueUrl, navigateToContinueURL } = useContinueUrl();

  useEffect(() => {
    if (
      pathname !== basePaths[BASE_ROUTES.LOGIN] &&
      state === AUTH_STATE.UNAUTHENTICATED
    ) {
      redirectWithContinueUrl(basePaths[BASE_ROUTES.LOGIN]);
    } else if (
      pathname === basePaths[BASE_ROUTES.LOGIN] &&
      state === AUTH_STATE.AUTHENTICATED
    ) {
      navigateToContinueURL(basePaths[BASE_ROUTES.CHARACTER]);
    }
  }, [pathname, state]);

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
