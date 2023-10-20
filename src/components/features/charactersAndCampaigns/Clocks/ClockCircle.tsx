import { Box, ButtonBase, SxProps, useTheme } from "@mui/material";
import { ClockSegment } from "./ClockSegment";
import { PropsWithChildren } from "react";

export interface ClockCircleProps {
  segments: number;
  value: number;
  onClick?: () => void;
}

export function ClockCircle(props: ClockCircleProps) {
  const { segments, value, onClick } = props;
  const theme = useTheme();

  const Wrapper = (
    props: PropsWithChildren<{
      onClick?: () => void;
      sx: SxProps;
    }>
  ) => {
    const { children, onClick, sx } = props;

    if (onClick) {
      return (
        <ButtonBase sx={sx} onClick={onClick}>
          {children}
        </ButtonBase>
      );
    }
    return <Box sx={sx}>{children}</Box>;
  };

  return (
    <Wrapper sx={{ borderRadius: 999 }} onClick={onClick}>
      <svg
        width="100"
        height="100"
        viewBox="-2 -2 104 104"
        stroke={theme.palette.grey[theme.palette.mode === "light" ? 700 : 600]}
      >
        {Array.from({ length: segments }).map((_, index) => (
          <ClockSegment
            key={index}
            index={index}
            segments={segments}
            filled={value}
          />
        ))}
      </svg>
    </Wrapper>
  );
}
