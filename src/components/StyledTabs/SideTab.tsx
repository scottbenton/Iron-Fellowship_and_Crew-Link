import { ReactNode } from "react";
import { Button } from "@mui/material";
import { Link, useMatch } from "react-router-dom";

export interface SideTabProps {
  label: string;
  to: string;
  icon?: ReactNode;
}

export function SideTab(props: SideTabProps) {
  const { label, to, icon } = props;

  const isSelected = useMatch(to) ? true : false;

  return (
    <Button
      component={Link}
      to={to}
      color={isSelected ? "secondary" : "primary"}
      startIcon={icon}
    >
      {label}
    </Button>
  );
}
