import { OracleRollable } from "@datasworn/core";
import { ListItem, ListItemText } from "@mui/material";
import { extraOracleListItemActionsProp } from "./oracleListItemActions";
import { Actions } from "./Actions";

export interface OracleRollableListItemProps {
  oracleRollable: OracleRollable;
  actions?: extraOracleListItemActionsProp;
  disabled?: boolean;
}

export function OracleRollableListItem(props: OracleRollableListItemProps) {
  const { oracleRollable, actions, disabled } = props;
  return (
    <ListItem
      sx={{
        "&:nth-of-type(even)": {
          bgcolor: "background.paperInlay",
        },
      }}
    >
      <ListItemText primary={oracleRollable.name} />
      <Actions actions={actions} item={oracleRollable} disabled={disabled} />
    </ListItem>
  );
}
