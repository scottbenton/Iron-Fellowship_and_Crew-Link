import { Box, ButtonBase, useTheme } from "@mui/material";
import { ClockSegment } from "./ClockSegment";
import { getClockValueText } from "functions/trackValueText";

export type ClockSize = "small" | "medium";

const sizes: Record<ClockSize, number> = {
  small: 60,
  medium: 100,
};

export interface ClockCircleProps {
  segments: number;
  value: number;
  onClick?: () => void;
  size?: ClockSize;
  // The clock's name, read out with its value.
  label?: string;
}

export function ClockCircle(props: ClockCircleProps) {
  const { segments, value, onClick, size = "medium", label } = props;
  const theme = useTheme();

  const valueText = getClockValueText(label, value, segments);

  const clock = (
    <svg
      width={sizes[size]}
      height={sizes[size]}
      viewBox="-2 -2 104 104"
      stroke={theme.palette.grey[theme.palette.mode === "light" ? 700 : 600]}
      aria-hidden
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
  );

  // Rendered directly, not through a component defined in here: a component
  // made on each render remounts every time, which drops keyboard focus.
  if (onClick) {
    return (
      <ButtonBase
        sx={{ borderRadius: 999 }}
        onClick={onClick}
        aria-label={`${valueText}. ${
          value >= segments ? "Clear all segments" : "Fill 1 segment"
        }`}
      >
        {clock}
      </ButtonBase>
    );
  }
  return (
    <Box sx={{ borderRadius: 999 }} role={"img"} aria-label={valueText}>
      {clock}
    </Box>
  );
}
