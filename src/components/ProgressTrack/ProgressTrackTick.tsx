import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Tick1, Tick2, Tick3, Tick4 } from "./assets";
export interface ProgressTrackTickProps {
  value: number;
}

const sizeDesktop = 32;
const sizeMobile = 20;

const tickProps = (sizeValue: number) => ({
  width: sizeValue,
  height: sizeValue,
  strokeWidth: 4,
  style: { stroke: "currentcolor" },
});

export function ProgressTrackTick(props: ProgressTrackTickProps) {
  const { value } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const size = isMobile ? sizeMobile : sizeDesktop;

  return (
    <Box
      sx={(theme) => ({
        width: size,
        height: size,
        [theme.breakpoints.down("sm")]: {
          width: sizeMobile,
          height: sizeMobile,
        },
      })}
    >
      {value === 1 && <Tick1 {...tickProps(size)} />}
      {value === 2 && <Tick2 {...tickProps(size)} />}
      {value === 3 && <Tick3 {...tickProps(size)} />}
      {value === 4 && <Tick4 {...tickProps(size)} />}
    </Box>
  );
}
