import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

export function RollContainer(props: PropsWithChildren) {
  const { children } = props;
  return (
    <Box display={"flex"} alignItems={"center"}>
      {children}
    </Box>
  );
}
