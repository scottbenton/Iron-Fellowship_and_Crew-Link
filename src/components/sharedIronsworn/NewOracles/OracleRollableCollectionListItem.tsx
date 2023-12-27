import {
  OracleTableSharedDetails,
  OracleTableSharedResults,
  OracleTableSharedRolls,
} from "@datasworn/core";
import { ListItemText } from "@mui/material";
import { OracleSelectableRollableCollectionListItem } from "./OracleSelectableRollableCollectionListItem";
import { extraOracleListItemActionsProp } from "./oracleListItemActions";
import { Actions } from "./Actions";
import { OptionalListItemButton } from "./OptionalListItemButton";
import { useRoller } from "stores/appState/useRoller";

export interface OracleRollableCollectionListItemProps {
  collection:
    | OracleTableSharedRolls
    | OracleTableSharedResults
    | OracleTableSharedDetails;
  actions?: extraOracleListItemActionsProp;
  disabled?: boolean;

  rollOnRowClick: boolean;
}

export function OracleRollableCollectionListItem(
  props: OracleRollableCollectionListItemProps
) {
  const { collection, actions, disabled, rollOnRowClick } = props;

  const { rollOracleTableNew } = useRoller();

  if (collection.oracle_type === "table_shared_rolls") {
    return (
      <OptionalListItemButton
        showButton={rollOnRowClick}
        sx={[
          {
            "&:nth-of-type(even)": {
              bgcolor: "background.paperInlay",
            },
          },
          rollOnRowClick && { pl: 0, py: 0 },
        ]}
        onClick={
          rollOnRowClick
            ? () => rollOracleTableNew(collection.id, true)
            : undefined
        }
        secondaryAction={
          <Actions actions={actions} item={collection} disabled={disabled} />
        }
      >
        <ListItemText primary={collection.name} />
      </OptionalListItemButton>
    );
  } else {
    return (
      <OracleSelectableRollableCollectionListItem
        collection={collection}
        actions={actions}
        disabled={disabled}
        rollOnRowClick={rollOnRowClick}
      />
    );
  }
}
