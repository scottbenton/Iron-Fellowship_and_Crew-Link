import { Stack, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
export type PreviewProps = PropsWithChildren<{}>;

export function Preview(props: PreviewProps) {
  const { children } = props;
  return (
    <Stack
      spacing={1}
      sx={{ px: 1, pb: 1, bgcolor: "background.paperInlay", borderRadius: 1 }}
    >
      <Typography variant={"overline"}>Preview</Typography>
      {children}
    </Stack>
  );
}
