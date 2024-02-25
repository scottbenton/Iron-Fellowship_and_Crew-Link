import { IconButton } from "@mui/material";
import { OracleListItemActionProps } from "./oracleListItemActions";
import TableIcon from "@mui/icons-material/ListAlt";
import { useStore } from "stores/store";

export function OracleListItemActionOpenDialogButton(
  props: OracleListItemActionProps
) {
  const { item, disabled } = props;
  const openDialog = useStore((store) => store.appState.openDialog);

  const handleOpenClick = () => {
    openDialog(item.id, true);
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
