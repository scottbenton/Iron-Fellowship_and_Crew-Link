import { Box, Typography } from "@mui/material";
import { Clock as IClock } from "types/Clock.type";
import { ClockCircle } from "./ClockCircle";

export interface ClockProps {
  clock: IClock;
}

export function Clock(props: ClockProps) {
  const { clock } = props;

  return (
    <Box>
      <Typography variant={"h5"}>{clock.label}</Typography>
      <ClockCircle value={clock.value} segments={clock.segments} />
    </Box>
  );
}
