import {
  OracleTableSharedResults,
  OracleTableSharedDetails,
} from "@datasworn/core";
import { Box, ListItemText, MenuItem, TextField } from "@mui/material";
import { useState } from "react";
import { extraOracleListItemActionsProp } from "./oracleListItemActions";
import { Actions } from "./Actions";
import { OptionalListItemButton } from "./OptionalListItemButton";
import { useRoller } from "stores/appState/useRoller";

export interface OracleSelectableRollableCollectionListItemProps {
  collection: OracleTableSharedResults | OracleTableSharedDetails;
  actions?: extraOracleListItemActionsProp;
  disabled?: boolean;
  rollOnRowClick: boolean;
}

export function OracleSelectableRollableCollectionListItem(
  props: OracleSelectableRollableCollectionListItemProps
) {
  const { collection, actions, disabled, rollOnRowClick } = props;
  const { rollOracleTableNew } = useRoller();

  const options = collection.contents ?? {};
  const keys = Object.keys(options);

  const [selectedOption, setSelectedOption] = useState<string>(keys[0] ?? "");

  const selectedOptionId = options[selectedOption]?.id;
  return (
    <OptionalListItemButton
      showButton={!!selectedOptionId && rollOnRowClick}
      sx={{
        "&:nth-of-type(even)": {
          bgcolor: "background.paperInlay",
        },
      }}
      onClick={
        rollOnRowClick && selectedOptionId
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
          <Actions actions={actions} item={collection} disabled={disabled} />
        </Box>
      }
    >
      <ListItemText primary={collection.name} />
    </OptionalListItemButton>
  );
}
