import { Container, Paper } from "@mui/material";
import { PropsWithChildren } from "react";

export interface PageContentProps extends PropsWithChildren {
  isPaper?: boolean;
  viewHeight?: boolean;
}

export function PageContent(props: PageContentProps) {
  const { children, isPaper, viewHeight } = props;

  return (
    <Container
      component={isPaper ? Paper : "div"}
      maxWidth={"xl"}
      sx={[
        (theme) => ({
          position: "relative",
          borderRadius: isPaper ? theme.shape.borderRadius : 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          overflow: "hidden",
          flexGrow: 1,
          [theme.breakpoints.down("sm")]: {
            paddingBottom: 9,
          },
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
