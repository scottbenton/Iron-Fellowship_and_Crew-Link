import { Box } from "@mui/material";
import { Tick1, Tick2, Tick3, Tick4 } from "./assets";
export interface ProgressTrackTickProps {
  value: number;
}

const size = 32;

const tickProps = {
  width: size,
  height: size,
  strokeWidth: 4,
  style: { stroke: "currentcolor" },
};

export function ProgressTrackTick(props: ProgressTrackTickProps) {
  const { value } = props;

  return (
    <Box width={size} height={size}>
      {value === 1 && <Tick1 {...tickProps} />}
      {value === 2 && <Tick2 {...tickProps} />}
      {value === 3 && <Tick3 {...tickProps} />}
      {value === 4 && <Tick4 {...tickProps} />}
    </Box>
  );
}
