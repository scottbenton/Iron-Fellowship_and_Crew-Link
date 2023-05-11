import { Tab, TabProps } from "@mui/material";
import React from "react";
import { Link, useMatch } from "react-router-dom";

export function StyledTab(props: TabProps) {
  const { ...tabProps } = props;

  return (
    <Tab
      sx={(theme) => ({
        zIndex: 1,
        borderRadius: theme.shape.borderRadius,
        height: "32px",
        minWidth: 64,
        minHeight: 1,
        textTransform: "unset",
      })}
      {...tabProps}
    />
  );
}
