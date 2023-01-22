import { Box, Container, SxProps, Theme, Typography } from "@mui/material";
import { SystemStyleObject } from "@mui/system";
import { PropsWithChildren } from "react";

export interface PageBannerProps extends PropsWithChildren {}

export function PageBanner(props: PageBannerProps) {
  const { children } = props;

  return (
    <Box
      sx={[
        (theme) => ({
          position: "relative",
          top: theme.spacing(-3),
          marginBottom: theme.spacing(-3),

          display: "flex",
          alignItems: "flex-end",

          marginX: theme.spacing(-3),
          px: 3,
          py: 1,

          height: 100,
          [theme.breakpoints.up("sm")]: {
            height: 150,
            py: 3,
          },
        }),
      ]}
    >
      <Box
        position={"absolute"}
        top={0}
        left={0}
        right={0}
        bottom={0}
        sx={{
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
          backgroundImage: "url(/assets/ForestBackdrop.jpg)",
          filter: "brightness(50%) grayscale(25%)",
        }}
      />
      {typeof children === "string" ? (
        <Typography
          variant={"h4"}
          color={"white"}
          position={"relative"}
          zIndex={20}
          fontFamily={(theme) => theme.fontFamilyTitle}
        >
          {children}
        </Typography>
      ) : (
        children
      )}
    </Box>
  );
}
