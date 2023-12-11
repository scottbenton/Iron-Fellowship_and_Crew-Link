import { Box, SxProps } from "@mui/material";
import { ReactNode } from "react";

export interface SectionWithSidebarProps {
  sidebar: ReactNode;
  sidebarWidth?: number;
  mainContent: ReactNode;
  sx?: SxProps;
}

export function SectionWithSidebar(props: SectionWithSidebarProps) {
  const { sidebar, sidebarWidth = 324, mainContent, sx } = props;

  return (
    <Box
      display={"flex"}
      sx={[
        (theme) => ({
          [theme.breakpoints.up("md")]: {
            overflow: "hidden",
            height: "100%",
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{
          height: "100%",
          width: sidebarWidth,
          display: { xs: "none", md: "block" },
        }}
      >
        {sidebar}
      </Box>
      <Box
        sx={(theme) => ({
          maxWidth: "100%",
          flexGrow: 1,
          [theme.breakpoints.up("md")]: {
            pl: 2,
            height: "100%",
            maxWidth: `calc(100% - ${sidebarWidth}px)`,
            width: "100%",
          },
        })}
      >
        <Box display={"flex"} height={"100%"} flexDirection={"column"}>
          {mainContent}
        </Box>
      </Box>
    </Box>
  );
}
