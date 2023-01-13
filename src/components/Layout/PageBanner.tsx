import { Box, Container, SxProps, Theme, Typography } from "@mui/material";
import { SystemStyleObject } from "@mui/system";
import { PropsWithChildren } from "react";

export interface PageBannerProps extends PropsWithChildren {
  sx?: SxProps;
  containerSx?: SxProps;
}

export function PageBanner(props: PageBannerProps) {
  const { children, sx, containerSx } = props;
  return (
    <Box
      sx={[
        (theme) => ({
          position: "relative",
          width: "100vw",
          left: `calc((100% - 100vw) / 2)`,
          top: theme.spacing(-3),
          backgroundColor: theme.palette.primary.light,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Container
        maxWidth={"xl"}
        sx={[
          (theme) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            paddingY: 2,
          }),
          ...(Array.isArray(containerSx) ? containerSx : [containerSx]),
        ]}
      >
        {typeof children === "string" ? (
          <Typography
            variant={"h4"}
            color={"white"}
            position={"relative"}
            fontFamily={(theme) => theme.fontFamilyTitle}
          >
            {children}
          </Typography>
        ) : (
          children
        )}
      </Container>
    </Box>
  );
}
