import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListSubheader,
  ListSubheaderProps,
} from "@mui/material";
import OpenIcon from "@mui/icons-material/ChevronRight";
import React from "react";

export interface CollapsibleSectionHeaderProps {
  component?: ListSubheaderProps["component"];
  text: string;
  forcedOpen?: boolean;
  open: boolean;
  toggleOpen: () => void;
  disabled?: boolean;
  actions?: React.JSX.Element;
}

export function CollapsibleSectionHeader(props: CollapsibleSectionHeaderProps) {
  const { component, text, open, forcedOpen, toggleOpen, disabled, actions } =
    props;

  if (forcedOpen) {
    return (
      <ListItem
        sx={(theme) => ({
          mt: open ? 0.5 : 0,
          backgroundColor: theme.palette.background.paperInlayDarker,
          color: theme.palette.grey[theme.palette.mode === "light" ? 700 : 200],
          ...theme.typography.body1,
          fontFamily: theme.fontFamilyTitle,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: theme.transitions.create(["margin"], {
            duration: theme.transitions.duration.shorter,
          }),
        })}
      >
        {text}
        <ListItemIcon sx={{ minWidth: "unset" }}>
          <OpenIcon
            sx={(theme) => ({
              transform: `rotate(${open ? "-" : ""}90deg)`,
              transition: theme.transitions.create(["transform"], {
                duration: theme.transitions.duration.shorter,
              }),
            })}
          />
        </ListItemIcon>
      </ListItem>
    );
  }

  return (
    <ListSubheader
      component={component ?? "li"}
      disableGutters
      sx={(theme) => ({
        mt: open ? 0.5 : 0,
        backgroundColor: theme.palette.background.paperInlayDarker,
        color: theme.palette.grey[theme.palette.mode === "light" ? 700 : 200],
        ...theme.typography.body1,
        fontFamily: theme.fontFamilyTitle,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: theme.transitions.create(["margin"], {
          duration: theme.transitions.duration.shorter,
        }),
      })}
    >
      {!forcedOpen ? (
        <>
          <ListItemButton onClick={toggleOpen} disabled={disabled}>
            <Box sx={{ flexGrow: 1 }}>{text}</Box>

            <ListItemIcon sx={{ minWidth: "unset" }}>
              <OpenIcon
                sx={(theme) => ({
                  transform: `rotate(${open ? "-" : ""}90deg)`,
                  transition: theme.transitions.create(["transform"], {
                    duration: theme.transitions.duration.shorter,
                  }),
                })}
              />
            </ListItemIcon>
          </ListItemButton>
        </>
      ) : (
        <ListItem slots={{ root: "div" }}>{text}</ListItem>
      )}
      {actions ? (
        <ListItemSecondaryAction sx={{ mr: 4 }}>
          {actions}
        </ListItemSecondaryAction>
      ) : undefined}
    </ListSubheader>
  );
}
