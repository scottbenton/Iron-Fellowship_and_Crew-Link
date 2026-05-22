import { Box } from "@mui/material";
import { Tick1, Tick2, Tick3, Tick4 } from "./assets";
import { useIsMobile } from "hooks/useIsMobile";
export interface ProgressTrackTickProps {
  value: number;
  size?: {
    desktop: number;
    mobile: number;
  };
}

const tickProps = (sizeValue: number) => ({
  width: sizeValue,
  height: sizeValue,
  strokeWidth: 4,
  style: { stroke: "currentcolor" },
  "aria-hidden": true,
});

export function ProgressTrackTick(props: ProgressTrackTickProps) {
  const { value, size = { desktop: 32, mobile: 20 } } = props;

  const isMobile = useIsMobile();

  const finalSize = isMobile ? size.mobile : size.desktop;

  return (
    <Box
      sx={{
        width: finalSize,
        height: finalSize,
      }}
    >
      {value === 1 && <Tick1 {...tickProps(finalSize)} />}
      {value === 2 && <Tick2 {...tickProps(finalSize)} />}
      {value === 3 && <Tick3 {...tickProps(finalSize)} />}
      {value === 4 && <Tick4 {...tickProps(finalSize)} />}
    </Box>
  );
}
