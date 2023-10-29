import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { D10Icon } from "assets/D10Icon";
import PinIcon from "@mui/icons-material/PushPin";
import { useState } from "react";
import { useIsTouchDevice } from "hooks/useIsTouchDevice";
import TableIcon from "@mui/icons-material/ListAlt";
import { useStore } from "stores/store";

export interface OracleListItemProps {
  id: string;
  onRollClick: () => void;
  text: string;
  onOpenClick: () => void;
  pinned?: boolean;
}

export function OracleListItem(props: OracleListItemProps) {
  const { id, text, onRollClick, onOpenClick, pinned } = props;

  const isTouchDevice = useIsTouchDevice();
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const updatePinnedOracle = useStore(
    (store) => store.settings.togglePinnedOracle
  );

  return (
    <ListItem
      id={id}
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
        <>
          {(isHovering || isTouchDevice) && (
            <IconButton onClick={() => onOpenClick()}>
              <TableIcon />
            </IconButton>
          )}

          {(isHovering || isTouchDevice || pinned) && (
            <IconButton
              color={pinned ? "primary" : "default"}
              onClick={() => updatePinnedOracle(id, !pinned).catch(() => {})}
              disabled={loading}
            >
              <PinIcon />
            </IconButton>
          )}
        </>
      }
    >
      <ListItemButton
        onClick={() => onRollClick()}
        sx={{ pr: "96px!important" }}
      >
        <ListItemIcon>
          <D10Icon />
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}
