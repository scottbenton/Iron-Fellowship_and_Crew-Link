import { Box, SxProps, Theme } from "@mui/material";
import { PropsWithChildren } from "react";

export interface BreakContainer extends PropsWithChildren {
  sx?: SxProps<Theme>;
}

export function BreakContainer(props: BreakContainer) {
  const { children, sx } = props;

  return (
    <Box
      sx={[
        (theme) => ({
          marginX: -3,
          [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
            marginX: -2,
          },
          borderColor: theme.palette.divider,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
