import { Datasworn } from "@datasworn/core";
import { ListItemText } from "@mui/material";
import { CATEGORY_VISIBILITY } from "./useFilterOracles";
import { useRoller } from "stores/appState/useRoller";
import { OracleListItemActionOpenDialogButton } from "./OracleListItemActionOpenDialogButton";
import { ListItemButtonWithSecondaryAction } from "./ListItemButtonWithSecondaryAction";

export interface OracleListItemProps {
  oracleId: string;
  oracles: Record<string, Datasworn.OracleRollable>;
  visibleOracles: Record<string, boolean>;
  disabled?: boolean;
  collectionVisibility?: CATEGORY_VISIBILITY;
}

export function OracleListItem(props: OracleListItemProps) {
  const { oracleId, oracles, visibleOracles, disabled, collectionVisibility } =
    props;

  const oracle = oracles[oracleId];
  const { rollOracleTableNew } = useRoller();

  if (
    (collectionVisibility !== CATEGORY_VISIBILITY.ALL &&
      !visibleOracles[oracleId]) ||
    !oracle
  ) {
    return null;
  }

  return (
    <ListItemButtonWithSecondaryAction
      secondaryAction={
        <OracleListItemActionOpenDialogButton
          item={oracle}
          disabled={disabled}
        />
      }
      disabled={disabled}
      onClick={() => rollOracleTableNew(oracle.id, true)}
    >
      <ListItemText primary={oracle.name} />
    </ListItemButtonWithSecondaryAction>
  );
}
