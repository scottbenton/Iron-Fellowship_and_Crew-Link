import { IconButton } from "@mui/material";
import TableIcon from "@mui/icons-material/ListAlt";
import { useStore } from "stores/store";
import { Datasworn } from "@datasworn-community/core";

export interface OracleListItemActionOpenDialogButtonProps {
  item: Datasworn.OracleCollection | Datasworn.OracleRollable;
  disabled?: boolean;
}

export function OracleListItemActionOpenDialogButton(
  props: OracleListItemActionOpenDialogButtonProps
) {
  const { item, disabled } = props;
  const openDialog = useStore((store) => store.appState.openDialog);

  const handleOpenClick = () => {
    openDialog(item._id);
  };

  return (
    <IconButton
      aria-label={"View Full Table"}
      disabled={disabled}
      id={"open-table"}
      onClick={handleOpenClick}
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
  );
}
