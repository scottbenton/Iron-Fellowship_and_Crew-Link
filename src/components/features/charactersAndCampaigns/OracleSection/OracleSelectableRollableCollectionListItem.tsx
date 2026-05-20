import { Datasworn } from "@datasworn/core";
import { Box, ListItemText, MenuItem, TextField } from "@mui/material";
import { useState } from "react";
import { useRoller } from "stores/appState/useRoller";
import { OracleListItemActionOpenDialogButton } from "./OracleListItemActionOpenDialogButton";
import { ListItemButtonWithSecondaryAction } from "./ListItemButtonWithSecondaryAction";
import { ToggleVisibilityButton } from "components/shared/ToggleVisibilityButton";
import { useStore } from "stores/store";

export interface OracleSelectableRollableCollectionListItemProps {
  collection:
    | Datasworn.OracleTableSharedText
    | Datasworn.OracleTableSharedText2
    | Datasworn.OracleTableSharedText3;
  disabled?: boolean;
  actionIsHide?: boolean;
  hidden?: boolean;
}

export function OracleSelectableRollableCollectionListItem(
  props: OracleSelectableRollableCollectionListItemProps
) {
  const { collection, disabled, actionIsHide, hidden } = props;
  const { rollOracleTable } = useRoller();

  const options = collection.contents ?? {};
  const keys = Object.keys(options);

  const [selectedOption, setSelectedOption] = useState<string>(keys[0] ?? "");

  const selectedOptionId = options[selectedOption]?._id;

  const updateHiddenOracles = useStore(
    (store) => store.campaigns.currentCampaign.updateHiddenOracles
  );

  const [hideIsloading, setHideIsLoading] = useState(false);

  const onToggleVisibility = () => {
    setHideIsLoading(true);
    updateHiddenOracles(collection._id, !hidden)
      .catch(() => {
      })
      .finally(() => {
        setHideIsLoading(false);
      });
  };

  if(!actionIsHide && hidden) {
    return null;
  }

  return (
    <ListItemButtonWithSecondaryAction
      disabled={disabled || !selectedOptionId}
      onClick={!actionIsHide ? () => rollOracleTable(selectedOptionId, true) : undefined}
      secondaryAction={
        <Box display={"flex"} alignItems={"center"}>
          {keys.length > 0 && !actionIsHide && (
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
          {actionIsHide && (
            <ToggleVisibilityButton
              onToggleVisibility={onToggleVisibility}
              loading={hideIsloading}
              hidden={hidden}
            />
          )}
        </Box>
      }
      sx={{
        filter: hidden ? "grayscale(30%) opacity(70%)" : undefined,
      }}
    >
      <ListItemText primary={collection.name} />
    </ListItemButtonWithSecondaryAction>
  );
}
