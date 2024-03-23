import { Datasworn } from "@datasworn/core";
import { ListSubheader, MenuItem, TextField, capitalize } from "@mui/material";
import { StoredAsset } from "types/Asset.type";

export interface AssetOptionProps {
  assetOptionKey: string;
  storedAsset?: StoredAsset;
  assetOption: Datasworn.AssetOptionField;
  onAssetOptionChange?: (assetOptionKey: string, value: string) => void;
}

export function AssetOption(props: AssetOptionProps) {
  const { assetOptionKey, storedAsset, assetOption, onAssetOptionChange } =
    props;

  switch (assetOption.field_type) {
    case "text":
      return (
        <TextField
          label={capitalize(assetOption.label)}
          defaultValue={
            storedAsset?.optionValues?.[assetOptionKey] ??
            assetOption.value ??
            ""
          }
          disabled={!onAssetOptionChange}
          onChange={(evt) =>
            onAssetOptionChange &&
            onAssetOptionChange(assetOptionKey, evt.target.value)
          }
          variant={"standard"}
          sx={{ mt: 0.5 }}
          fullWidth
        />
      );
    case "select_enhancement":
      return (
        <TextField
          select
          label={capitalize(assetOption.label)}
          defaultValue={
            storedAsset?.optionValues?.[assetOptionKey] ??
            assetOption.value ??
            ""
          }
          disabled={!onAssetOptionChange}
          onChange={(evt) =>
            onAssetOptionChange &&
            onAssetOptionChange(assetOptionKey, evt.target.value)
          }
          variant={"standard"}
          sx={{ mt: 0.5 }}
          fullWidth
        >
          {Object.keys(assetOption.choices).map((choiceKey) => {
            const choice = assetOption.choices[choiceKey];
            if (choice.choice_type === "choice_group") {
              return (
                <div key={choiceKey}>
                  <ListSubheader>{choice.name}</ListSubheader>
                  {Object.keys(choice.choices).map((subChoiceKey) => (
                    <MenuItem key={subChoiceKey} value={subChoiceKey}>
                      {capitalize(choice.choices[subChoiceKey].label)}
                    </MenuItem>
                  ))}
                </div>
              );
            }
            return (
              <MenuItem key={choiceKey} value={choiceKey}>
                {capitalize(choice.label)}
              </MenuItem>
            );
          })}
        </TextField>
      );
    case "select_value":
      return (
        <TextField
          select
          label={capitalize(assetOption.label)}
          defaultValue={
            storedAsset?.optionValues?.[assetOptionKey] ??
            assetOption.value ??
            ""
          }
          disabled={!onAssetOptionChange}
          onChange={(evt) =>
            onAssetOptionChange &&
            onAssetOptionChange(assetOptionKey, evt.target.value)
          }
          variant={"standard"}
          sx={{ mt: 0.5 }}
          fullWidth
        >
          {Object.keys(assetOption.choices).map((choiceKey) => {
            const choice = assetOption.choices[choiceKey];
            return (
              <MenuItem key={choiceKey} value={choiceKey}>
                {capitalize(choice.label)}
              </MenuItem>
            );
          })}
        </TextField>
      );
  }

  return null;
}
