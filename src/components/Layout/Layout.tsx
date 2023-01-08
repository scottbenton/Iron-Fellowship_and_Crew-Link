import { Box, Container, LinearProgress } from "@mui/material";
import { PropsWithChildren } from "react";
import { AUTH_STATE, useAuth } from "../../hooks/useAuth";
import { Header } from "./Header";

export interface LayoutProps extends PropsWithChildren {}

export function Layout(props: LayoutProps) {
  const { children } = props;

  const { authState } = useAuth();

  if (authState === AUTH_STATE.LOADING) {
    return <LinearProgress />;
  }

  return (
    <Box minHeight={"100vh"} display={"flex"} flexDirection={"column"}>
      <Header />
      <Container
        maxWidth={"xl"}
        sx={(theme) => ({
          py: 4,
          backgroundColor: theme.palette.background.paper,
          flexGrow: 1,
        })}
      >
        {children}
      </Container>
    </Box>
  );
}
