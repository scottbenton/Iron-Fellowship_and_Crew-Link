import { Breakpoint, Container, Paper } from "@mui/material";
import { PropsWithChildren } from "react";

export interface PageContentProps extends PropsWithChildren {
  isPaper?: boolean;
  viewHeight?: boolean;
  maxWidth?: false | Breakpoint;
}

export function PageContent(props: PageContentProps) {
  const { children, isPaper, viewHeight, maxWidth } = props;

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
          overflow: "hidden",
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
            })
          : {},
      ]}
    >
      {children}
    </Container>
  );
}
