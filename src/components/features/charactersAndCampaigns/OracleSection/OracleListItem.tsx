import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useIsTouchDevice } from "hooks/useIsTouchDevice";
import TableIcon from "@mui/icons-material/ListAlt";

export interface OracleListItemProps {
  id: string;
  onRollClick: () => void;
  text: string;
  onOpenClick: () => void;
}

export function OracleListItem(props: OracleListItemProps) {
  const { id, text, onRollClick, onOpenClick } = props;

  const isTouchDevice = useIsTouchDevice();

  return (
    <ListItem
      id={id}
      disablePadding
      sx={(theme) => ({
        "&:nth-of-type(even)": {
          backgroundColor: theme.palette.background.paperInlay,
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
