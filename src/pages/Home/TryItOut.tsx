import { Box, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

export function TryItOut(props: PropsWithChildren) {
  const { children } = props;

  return (
    <Box
      sx={(theme) => ({
        bgcolor: theme.palette.background.paperInlay,
        p: 1,
        borderRadius: theme.shape.borderRadius + "px",
      })}
    >
      <Typography
        variant={"subtitle2"}
        component={"p"}
        color={"textSecondary"}
        sx={{ mb: 1 }}
      >
        TRY IT OUT
      </Typography>
      {children}
    </Box>
  );
}
