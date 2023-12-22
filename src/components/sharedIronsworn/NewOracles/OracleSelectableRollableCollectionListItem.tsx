import {
  OracleTableSharedResults,
  OracleTableSharedDetails,
} from "@datasworn/core";
import {
  Box,
  ListItem,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { extraOracleListItemActionsProp } from "./oracleListItemActions";
import { Actions } from "./Actions";

export interface OracleSelectableRollableCollectionListItemProps {
  collection: OracleTableSharedResults | OracleTableSharedDetails;
  actions?: extraOracleListItemActionsProp;
  disabled?: boolean;
}

export function OracleSelectableRollableCollectionListItem(
  props: OracleSelectableRollableCollectionListItemProps
) {
  const { collection, actions, disabled } = props;

  const options = collection.contents ?? {};
  const keys = Object.keys(options);

  const [selectedOption, setSelectedOption] = useState<string>(keys[0] ?? "");

  return (
    <ListItem
      sx={{
        "&:nth-of-type(even)": {
          bgcolor: "background.paperInlay",
        },
      }}
    >
      <ListItemText primary={collection.name} />
      <Box display={"flex"} alignItems={"center"}>
        {keys.length > 0 && (
          <TextField
            aria-label={"Oracle Option"}
            size={"small"}
            select
            sx={{ minWidth: 150 }}
            value={selectedOption}
            onChange={(evt) => setSelectedOption(evt.target.value)}
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
    </ListItem>
  );
}
