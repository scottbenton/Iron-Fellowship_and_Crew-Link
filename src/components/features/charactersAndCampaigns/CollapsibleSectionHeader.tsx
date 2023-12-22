import {
  Box,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListSubheader,
  ListSubheaderProps,
} from "@mui/material";
import OpenIcon from "@mui/icons-material/ChevronRight";

export interface CollapsibleSectionHeaderProps {
  component?: ListSubheaderProps["component"];
  text: string;
  forcedOpen?: boolean;
  open: boolean;
  toggleOpen: () => void;
  disabled?: boolean;
}

export function CollapsibleSectionHeader(props: CollapsibleSectionHeaderProps) {
  const { component, text, open, forcedOpen, toggleOpen, disabled } = props;

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
      ) : (
        <ListItem>{text}</ListItem>
      )}
    </ListSubheader>
  );
}
