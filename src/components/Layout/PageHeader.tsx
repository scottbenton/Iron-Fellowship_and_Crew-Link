import { Box, Container, Stack, Typography } from "@mui/material";
import { Border } from "assets/Border";
import React, { PropsWithChildren } from "react";

export interface PageHeaderProps extends PropsWithChildren {
  label?: string | React.ReactNode;
  subLabel?: string;
  actions?: React.ReactNode;
}

export function PageHeader(props: PageHeaderProps) {
  const { label, subLabel, actions, children } = props;

  const isEmpty = !label && !subLabel && !actions && !children;

  return (
    <>
      <Box
        sx={(theme) => ({
          color: theme.palette.darkGrey.contrastText,
          pt: isEmpty ? 0 : 4,
          pb: 12,
          mb: isEmpty ? -18 : -12,
          width: "100vw",
          backgroundColor: theme.palette.darkGrey.main,
        })}
      >
        <Container
          maxWidth={"xl"}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {children ? (
            <>{children}</>
          ) : (
            <>
              <Box>
                {label &&
                  (typeof label === "string" ? (
                    <Typography
                      variant={"h4"}
                      component={"h1"}
                      fontFamily={(theme) => theme.fontFamilyTitle}
                    >
                      {label}
                    </Typography>
                  ) : (
                    label
                  ))}
                {subLabel && (
                  <Typography
                    variant={"h6"}
                    component={"h2"}
                    fontFamily={(theme) => theme.fontFamilyTitle}
                  >
                    {subLabel}
                  </Typography>
                )}
              </Box>
              {actions && (
                <Stack direction={"row"} spacing={1} flexWrap={"wrap"}>
                  {actions}
                </Stack>
              )}
            </>
          )}
        </Container>
      </Box>
      <Box
        sx={(theme) => ({
          backgroundImage: `url("${
            theme.palette.mode === "light"
              ? "/assets/border.svg"
              : "/assets/border-dark.svg"
          }")`,
          position: "relative",
          top: theme.spacing(isEmpty ? 18 : 12),
          mt: "-1px",
          mx: -2,
          transform: "rotate(180deg)",
          height: theme.spacing(6),
          backgroundRepeat: "repeat-x",
          backgroundSize: "contain",
          backgroundPositionY: "bottom",
          minWidth: 1000,
        })}
      />
    </>
  );
}
