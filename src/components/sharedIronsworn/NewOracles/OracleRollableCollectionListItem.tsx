import {
  OracleTableSharedDetails,
  OracleTableSharedResults,
  OracleTableSharedRolls,
} from "@datasworn/core";
import { ListItem, ListItemText } from "@mui/material";
import { OracleSelectableRollableCollectionListItem } from "./OracleSelectableRollableCollectionListItem";
import { extraOracleListItemActionsProp } from "./oracleListItemActions";
import { Actions } from "./Actions";

export interface OracleRollableCollectionListItemProps {
  collection:
    | OracleTableSharedRolls
    | OracleTableSharedResults
    | OracleTableSharedDetails;
  actions?: extraOracleListItemActionsProp;
  disabled?: boolean;
}

export function OracleRollableCollectionListItem(
  props: OracleRollableCollectionListItemProps
) {
  const { collection, actions, disabled } = props;

  if (collection.oracle_type === "table_shared_rolls") {
    return (
      <ListItem
        sx={{
          "&:nth-of-type(even)": {
            bgcolor: "background.paperInlay",
          },
        }}
      >
        <ListItemText primary={collection.name} />
        <Actions actions={actions} item={collection} disabled={disabled} />
      </ListItem>
    );
  } else {
    return (
      <OracleSelectableRollableCollectionListItem
        collection={collection}
        actions={actions}
        disabled={disabled}
      />
    );
  }
}
