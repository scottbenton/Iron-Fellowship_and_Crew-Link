import { Box, Container, LinearProgress, useTheme } from "@mui/material";
import { PropsWithChildren } from "react";
import { AUTH_STATE, useAuth } from "../../hooks/useAuth";
import { Header } from "./Header";

export interface LayoutProps extends PropsWithChildren {}

export function Layout(props: LayoutProps) {
  const { children } = props;
  const theme = useTheme();

  const { authState } = useAuth();

  if (authState === AUTH_STATE.LOADING) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Header />
      <Container maxWidth={"xl"}>{children}</Container>
    </Box>
  );
}
