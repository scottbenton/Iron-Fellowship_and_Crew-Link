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
        },
        "& #open-table": {
          display: isTouchDevice ? "inline-flex" : "none",
        },
        "&:hover": {
          backgroundColor: theme.palette.action.selected,
          "& #open-table": {
            display: "inline-flex",
          },
        },
        "&:focus-visible #open-table": {
          display: "inline-flex",
        },
      })}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      secondaryAction={
        <IconButton
          id={"open-table"}
          onClick={() => onOpenClick()}
          sx={{
            "&:focus-visible": {
              display: "inline-flex",
            },
            "&:hover": {
              display: "inline-flex",
            },
          }}
        >
          <TableIcon />
        </IconButton>
      }
    >
      <ListItemButton
        onClick={() => onRollClick()}
        sx={{ pr: "96px!important" }}
      >
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}
