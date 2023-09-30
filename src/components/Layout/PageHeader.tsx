import { Box, Container, Stack, Typography, useTheme } from "@mui/material";
import { Border } from "assets/Border";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import React, { PropsWithChildren } from "react";
import { GAME_SYSTEMS } from "types/GameSystems.type";

export interface PageHeaderProps extends PropsWithChildren {
  label?: string | React.ReactNode;
  subLabel?: string;
  actions?: React.ReactNode;
}

export function PageHeader(props: PageHeaderProps) {
  const { label, subLabel, actions, children } = props;

  const isEmpty = !label && !subLabel && !actions && !children;

  const isLightTheme = useTheme().palette.mode === "light";

  const isIronsworn = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: true,
    [GAME_SYSTEMS.STARFORGED]: false,
  });

  return (
    <>
      <Box
        sx={(theme) => ({
          color: theme.palette.darkGrey.contrastText,
          pt: isEmpty ? 0 : 4,
          pb: isIronsworn ? 12 : 14,
          mb: isIronsworn ? (isEmpty ? -18 : -12) : isEmpty ? -14 : -8,
          width: "100vw",
          backgroundColor: isLightTheme
            ? theme.palette.darkGrey.main
            : undefined,

          ...(!isIronsworn
            ? {
                borderBottomLeftRadius: "50% 9%",
                borderBottomRightRadius: "50% 9%",
              }
            : {}),
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
      {isIronsworn && (
        <Box
          sx={(theme) => ({
            backgroundImage: isLightTheme
              ? `url("${"/assets/border.svg"}")`
              : undefined,
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
      )}
    </>
  );
}
