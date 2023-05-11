import { Box } from "@mui/material";
import { SideTab } from "./SideTab";
import { ReactNode } from "react";
import { Outlet } from "react-router-dom";

export interface SideTabsProps {
  tabs: {
    label: string;
    icon?: ReactNode;
    to: string;
  }[];
}

export function SideTabs(props: SideTabsProps) {
  const { tabs } = props;

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",

        [theme.breakpoints.up("md")]: {
          flexDirection: "row",
        },
      })}
    >
      <Box>
        {tabs.map((tab) => (
          <SideTab to={tab.to} label={tab.label} icon={tab.icon} />
        ))}
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}
