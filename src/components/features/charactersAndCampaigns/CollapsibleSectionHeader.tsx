import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListSubheader,
} from "@mui/material";
import OpenIcon from "@mui/icons-material/ChevronRight";

export interface CollapsibleSectionHeaderProps {
  text: string;
  open: boolean;
  toggleOpen: () => void;
}

export function CollapsibleSectionHeader(props: CollapsibleSectionHeaderProps) {
  const { text, open, toggleOpen } = props;

  return (
    <ListSubheader
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
      <ListItemButton onClick={toggleOpen}>
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
    </ListSubheader>
  );
}
