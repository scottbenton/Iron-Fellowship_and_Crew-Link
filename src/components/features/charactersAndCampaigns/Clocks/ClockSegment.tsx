import { useTheme } from "@mui/material";

export interface ClockSegmentProps {
  index: number;
  segments: number;
  filled: number;
}

export function ClockSegment(props: ClockSegmentProps) {
  const { index, segments, filled } = props;

  const angle = 360 / segments;
  const isFilled = index < filled;
  const startAngle = angle * index;
  const endAngle = startAngle + angle;

  const largeArcFlag = angle > 180 ? 1 : 0;

  const startX = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
  const startY = 50 - 50 * Math.cos((Math.PI * startAngle) / 180);
  const endX = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
  const endY = 50 - 50 * Math.cos((Math.PI * endAngle) / 180);

  const theme = useTheme();

  return (
    <path
      d={`M 50 50 L ${startX} ${startY} A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY} z`}
      strokeWidth={4}
      fill={isFilled ? theme.palette.grey[300] : theme.palette.background.paper}
    />
  );
}
