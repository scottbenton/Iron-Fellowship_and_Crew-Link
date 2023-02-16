import {
  Button,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { D10Icon } from "assets/D10Icon";
import PinIcon from "@mui/icons-material/PushPin";
import { useState } from "react";
import { useUpdatePinnedOracle } from "api/user/settings/updatePinnedOracle";

export interface OracleListItemProps {
  onRollClick: () => void;
  text: string;
  onOpenClick: () => void;
  pinned?: boolean;
}

export function OracleListItem(props: OracleListItemProps) {
  const { text, onRollClick, onOpenClick, pinned } = props;

  const isMobile = "onTouchStart" in window;

  const [isHovering, setIsHovering] = useState<boolean>(false);

  const { updatePinnedOracle, loading } = useUpdatePinnedOracle();

  return (
    <ListItem
      disablePadding
      sx={(theme) => ({
        "&:nth-of-type(odd)": {
          backgroundColor: theme.palette.action.hover,
          "&:hover": {
            backgroundColor: theme.palette.action.selected,
          },
        },
      })}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      secondaryAction={
        isHovering || isMobile ? (
          <>
            <Button color={"primary"} onClick={() => onOpenClick()}>
              View Table
            </Button>
            <IconButton
              color={pinned ? "secondary" : undefined}
              onClick={() =>
                updatePinnedOracle({ oracleName: text, pinned: !pinned })
              }
              disabled={loading}
            >
              <PinIcon />
            </IconButton>
          </>
        ) : undefined
      }
    >
      <ListItemButton onClick={() => onRollClick()}>
        <ListItemIcon>
          <D10Icon />
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}
