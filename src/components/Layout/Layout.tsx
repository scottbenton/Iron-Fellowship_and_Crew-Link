import { Box, Container, LinearProgress } from "@mui/material";
import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AUTH_STATE, useAuth } from "../../hooks/useAuth";
import { paths, ROUTES } from "../../routes";
import { Header } from "./Header";

export interface LayoutProps extends PropsWithChildren {}

export function Layout(props: LayoutProps) {
  const { children } = props;

  const { pathname } = useLocation();
  const { authState } = useAuth();

  if (authState === AUTH_STATE.LOADING) {
    return <LinearProgress />;
  }

  return (
    <Box minHeight={"100vh"} display={"flex"} flexDirection={"column"}>
      {pathname !== paths[ROUTES.LOGIN] &&
        authState === AUTH_STATE.UNAUTHENTICATED && (
          <Navigate to={paths[ROUTES.LOGIN]} />
        )}
      {pathname === paths[ROUTES.LOGIN] &&
        authState === AUTH_STATE.AUTHENTICATED && (
          <Navigate to={paths[ROUTES.CHARACTER_SELECT]} />
        )}
      <Header />
      <Container
        maxWidth={"xl"}
        sx={(theme) => ({
          py: 3,
          backgroundColor: theme.palette.background.paper,
          flexGrow: 1,
        })}
      >
        {children}
      </Container>
    </Box>
  );
}
