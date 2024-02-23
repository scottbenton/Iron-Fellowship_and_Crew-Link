import { Datasworn } from "@datasworn/core";
import { ListItemText } from "@mui/material";
import { extraOracleListItemActionsProp } from "./oracleListItemActions";
import { Actions } from "./Actions";
import { OptionalListItemButton } from "./OptionalListItemButton";
import { useRoller } from "stores/appState/useRoller";

export interface OracleRollableListItemProps {
  oracleRollable: Datasworn.OracleRollable;
  actions?: extraOracleListItemActionsProp;
  disabled?: boolean;

  rollOnRowClick: boolean;
}

export function OracleRollableListItem(props: OracleRollableListItemProps) {
  const { oracleRollable, actions, disabled, rollOnRowClick } = props;
  const { rollOracleTableNew } = useRoller();

  return (
    <OptionalListItemButton
      showButton={rollOnRowClick}
      sx={{
        "&:nth-of-type(even)": {
          bgcolor: "background.paperInlay",
        },
      }}
      onClick={
        rollOnRowClick
          ? () => rollOracleTableNew(oracleRollable.id, true)
          : undefined
      }
      secondaryAction={
        <Actions actions={actions} item={oracleRollable} disabled={disabled} />
      }
    >
      <ListItemText primary={oracleRollable.name} />
    </OptionalListItemButton>
  );
}
