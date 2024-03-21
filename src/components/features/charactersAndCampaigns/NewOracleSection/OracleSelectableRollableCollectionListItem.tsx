import { Datasworn } from "@datasworn/core";
import { Box, ListItemText, MenuItem, TextField } from "@mui/material";
import { useState } from "react";
import { useRoller } from "stores/appState/useRoller";
import { OracleListItemActionOpenDialogButton } from "./OracleListItemActionOpenDialogButton";
import { ListItemButtonWithSecondaryAction } from "./ListItemButtonWithSecondaryAction";

export interface OracleSelectableRollableCollectionListItemProps {
  collection:
    | Datasworn.OracleTableSharedResults
    | Datasworn.OracleTableSharedDetails;
  disabled?: boolean;
}

export function OracleSelectableRollableCollectionListItem(
  props: OracleSelectableRollableCollectionListItemProps
) {
  const { collection, disabled } = props;
  const { rollOracleTableNew } = useRoller();

  const options = collection.contents ?? {};
  const keys = Object.keys(options);

  const [selectedOption, setSelectedOption] = useState<string>(keys[0] ?? "");

  const selectedOptionId = options[selectedOption]?._id;
  return (
    <ListItemButtonWithSecondaryAction
      disabled={disabled || !selectedOptionId}
      onClick={
        selectedOptionId
          ? () => rollOracleTableNew(selectedOptionId, true)
          : undefined
      }
      secondaryAction={
        <Box display={"flex"} alignItems={"center"}>
          {keys.length > 0 && (
            <TextField
              aria-label={"Oracle Option"}
              size={"small"}
              select
              sx={{ minWidth: 100 }}
              value={selectedOption}
              onChange={(evt) => {
                setSelectedOption(evt.target.value);
              }}
              disabled={disabled}
            >
              {keys.map((key) => (
                <MenuItem key={key} value={key}>
                  {options[key].name}
                </MenuItem>
              ))}
            </TextField>
          )}
          <OracleListItemActionOpenDialogButton
            item={collection}
            disabled={disabled}
          />
        </Box>
      }
    >
      <ListItemText primary={collection.name} />
    </ListItemButtonWithSecondaryAction>
  );
}
