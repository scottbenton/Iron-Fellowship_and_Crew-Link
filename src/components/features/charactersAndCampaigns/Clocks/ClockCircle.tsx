import { useTheme } from "@mui/material";
import { ClockSegment } from "./ClockSegment";

export interface ClockCircleProps {
  segments: number;
  value: number;
}

export function ClockCircle(props: ClockCircleProps) {
  const { segments, value } = props;
  const theme = useTheme();

  return (
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
  );
}
