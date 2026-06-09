import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

export interface ContainedTabPanelProps extends PropsWithChildren {
  greyBackground?: boolean;
  isVisible: boolean;
  overflowAuto?: boolean;
  excludePadding?: boolean;
}

export function ContainedTabPanel(props: ContainedTabPanelProps) {
  const {
    greyBackground,
    isVisible,
    overflowAuto = true,
    excludePadding,
    children,
  } = props;

  if (!isVisible) return null;

  return (
    <Box
      role={"tabpanel"}
      flexGrow={1}
      bgcolor={(theme) =>
        greyBackground ? theme.palette.background.paperInlay : undefined
      }
      sx={(theme) => ({
        overflowY: overflowAuto ? "auto" : "scroll",
        scrollbarColor: `${theme.palette.divider} rgba(0, 0, 0, 0)`,
        scrollbarWidth: "thin",
        pb: excludePadding ? 0 : 2,
      })}
    >
      {children}
    </Box>
  );
}
