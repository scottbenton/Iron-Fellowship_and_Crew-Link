import { Box, Container, Stack, Typography, useTheme } from "@mui/material";
import { useThemeValue } from "providers/ThemeProvider/useThemeValue";
import React, { PropsWithChildren } from "react";

export interface PageHeaderProps extends PropsWithChildren {
  label?: string | React.ReactNode;
  subLabel?: string | React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader(props: PageHeaderProps) {
  const { label, subLabel, actions, children } = props;

  const isEmpty = !label && !subLabel && !actions && !children;

  const isLightTheme = useTheme().palette.mode === "light";

  const background = useThemeValue("background") as
    | {
        type: "background" | "separator";
        node: React.ReactNode;
      }
    | undefined;

  return (
    <>
      <Box
        sx={(theme) => ({
          color: theme.palette.darkGrey.contrastText,
          pt: isEmpty ? 4 : 2,
          pb: isEmpty ? 8 : 6,
          mb: isEmpty ? -8 : -4,
          // width: "100vw",
          backgroundColor:
            isLightTheme && background?.type === "separator"
              ? theme.palette.darkGrey.main
              : undefined,
          position: "relative",
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
                {subLabel &&
                  (typeof subLabel === "string" ? (
                    <Typography
                      variant={"h6"}
                      component={"h2"}
                      fontFamily={(theme) => theme.fontFamilyTitle}
                    >
                      {subLabel}
                    </Typography>
                  ) : (
                    subLabel
                  ))}
              </Box>
              {actions && (
                <Stack direction={"row"} spacing={1} flexWrap={"wrap"}>
                  {actions}
                </Stack>
              )}
            </>
          )}
        </Container>
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            mt: "-1px",
            mx: 0,
            overflowX: "hidden",
            width: "100%",
          }}
        >
          {background?.type === "separator" ? <>{background.node}</> : null}
        </Box>
      </Box>
    </>
  );
}
