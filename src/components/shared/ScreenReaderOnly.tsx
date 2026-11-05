import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

export interface ScreenReaderOnlyProps {
  id?: string;
  live?: boolean;
}

export function ScreenReaderOnly(
  props: PropsWithChildren<ScreenReaderOnlyProps>
) {
  const { id, live, children } = props;

  return (
    <Box
      position={"absolute"}
      width={"1px"}
      height={"1px"}
      padding={0}
      margin={"-1px"}
      overflow={"hidden"}
      whiteSpace={"nowrap"}
      border={0}
      sx={{ clip: "rect(0, 0, 0, 0)", clipPath: "inset(50%)" }}
      aria-live={live ? "polite" : undefined}
      id={id}
    >
      {children}
    </Box>
  );
}
