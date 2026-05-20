import { Box, SxProps } from "@mui/material";
import { ReactNode } from "react";
import { useStore } from "stores/store";
import { ReferenceSidebarLocation } from "types/Layouts.type";

export interface SectionWithSidebarProps {
  sidebar?: ReactNode;
  sidebarWidth?: number;
  mainContent: ReactNode;
  sx?: SxProps;
  respectUserSetting?: boolean;
}

export function SectionWithSidebar(props: SectionWithSidebarProps) {
  const {
    sidebar,
    sidebarWidth = 300,
    mainContent,
    sx,
    respectUserSetting,
  } = props;

  const renderOnLeft = useStore((store) =>
    respectUserSetting
      ? store.auth.userDoc?.layout?.referenceSidebarLocation !==
        ReferenceSidebarLocation.Right
      : true
  );

  const actualWidth = sidebar ? sidebarWidth : 0;

  return (
    <Box
      display={"flex"}
      flexDirection={renderOnLeft ? "row" : "row-reverse"}
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
      {sidebar && (
        <Box
          sx={{
            height: "100%",
            width: actualWidth,
            display: { xs: "none", md: "block" },
          }}
        >
          {sidebar}
        </Box>
      )}
      <Box
        sx={(theme) => ({
          maxWidth: "100%",
          flexGrow: 1,
          [theme.breakpoints.up("md")]: {
            pl: sidebar && renderOnLeft ? 2 : 0,
            pr: sidebar && !renderOnLeft ? 2 : 0,
            height: "100%",
            maxWidth: `calc(100% - ${actualWidth}px)`,
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
