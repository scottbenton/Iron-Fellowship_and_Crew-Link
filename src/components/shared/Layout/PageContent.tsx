import { Breakpoint, Container, Paper, SxProps, Theme } from "@mui/material";
import { PropsWithChildren } from "react";

export interface PageContentProps extends PropsWithChildren {
  isPaper?: boolean;
  viewHeight?: boolean;
  maxWidth?: false | Breakpoint;
  sx?: SxProps<Theme>;
}

export function PageContent(props: PageContentProps) {
  const { children, isPaper, viewHeight, maxWidth, sx } = props;

  return (
    <Container
      component={isPaper ? Paper : "div"}
      maxWidth={maxWidth ?? "xl"}
      sx={[
        (theme) => ({
          position: "relative",
          borderRadius: isPaper ? `${theme.shape.borderRadius}px` : 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          flexGrow: 1,

          pb: 2,
          display: "flex",
          flexDirection: "column",
        }),
        viewHeight
          ? (theme) => ({
              [theme.breakpoints.up("md")]: {
                display: "flex",
                flexDirection: "column",
                height: "100vh",
              },
              mt: -4,
              borderRadius: 0,
            })
          : {},
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Container>
  );
}
