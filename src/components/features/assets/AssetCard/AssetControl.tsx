import { Datasworn } from "@datasworn/core";
import {
  Box,
  Checkbox,
  FormControlLabel,
  ListSubheader,
  MenuItem,
  TextField,
  capitalize,
} from "@mui/material";
import { Track } from "components/features/Track";
import { AssetControls } from "./AssetControls";
import { AssetDocument } from "api-calls/assets/_asset.type";
import { AssetControlCounter } from "./AssetControlCounter";
import { AssetControlClock } from "./AssetControlClock";

export interface AssetControlProps {
  controlId: string;
  control: Datasworn.AssetControlField | Datasworn.AssetAbilityControlField;
  storedAsset?: AssetDocument;
  onControlChange?: (
    controlKey: string,
    value: boolean | string | number
  ) => void;
}
export function AssetControl(props: AssetControlProps) {
  const { controlId, control, storedAsset, onControlChange } = props;

  const controlValue = storedAsset?.controlValues?.[controlId];

  switch (control.field_type) {
    case "select_enhancement":
      return (
        <TextField
          select
          label={capitalize(control.label)}
          defaultValue={
            typeof controlValue === "string"
              ? (controlValue as string)
              : control.value ?? ""
          }
          disabled={!onControlChange}
          onChange={(evt) =>
            onControlChange && onControlChange(controlId, evt.target.value)
          }
          variant={"standard"}
          fullWidth
        >
          {Object.keys(control.choices).map((choiceKey) => {
            const choice = control.choices[choiceKey];
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
    case "card_flip":
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={
                typeof controlValue === "boolean"
                  ? (controlValue as boolean)
                  : control.value ?? false
              }
              disabled={!onControlChange}
              onChange={(evt, checked) =>
                onControlChange && onControlChange(controlId, checked)
              }
            />
          }
          label={capitalize(control.label)}
        />
      );
    case "checkbox":
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={
                typeof controlValue === "boolean"
                  ? (controlValue as boolean)
                  : control.value ?? false
              }
              disabled={!onControlChange}
              onChange={(evt, checked) =>
                onControlChange && onControlChange(controlId, checked)
              }
            />
          }
          label={capitalize(control.label)}
        />
      );
    case "condition_meter": {
      const subControls = control.controls;
      return (
        <Box>
          {subControls && (
            <Box
              display={"flex"}
              justifyContent={"flex-end"}
              flexWrap={"wrap"}
              mr={1}
            >
              <AssetControls
                controls={subControls}
                storedAsset={storedAsset}
                row
                onControlChange={onControlChange}
              />
            </Box>
          )}
          <Track
            label={control.label}
            min={control.min}
            max={control.max}
            value={
              typeof controlValue === "number"
                ? (controlValue as number)
                : control.value ?? 0
            }
            disabled={!onControlChange}
            onChange={
              onControlChange
                ? (value) => {
                    return new Promise((res) => {
                      onControlChange(controlId, value);
                      res();
                    });
                  }
                : undefined
            }
            rollable={true}
          />
        </Box>
      );
    }
    case "text": {
      return (
        <TextField
          label={capitalize(control.label)}
          defaultValue={
            storedAsset?.controlValues?.[controlId] ?? control.value ?? ""
          }
          disabled={!onControlChange}
          onChange={(evt) =>
            onControlChange && onControlChange(controlId, evt.target.value)
          }
          variant={"standard"}
          sx={{ mt: 0.5 }}
          fullWidth
        />
      );
    }
    case "clock": {
      return (
        <AssetControlClock
          field={control}
          value={typeof controlValue === "number" ? controlValue : undefined}
          onChange={
            onControlChange
              ? (value) => onControlChange(controlId, value)
              : undefined
          }
        />
      );
    }
    case "counter": {
      return (
        <AssetControlCounter
          value={typeof controlValue === "number" ? controlValue : undefined}
          field={control}
          onChange={
            onControlChange
              ? (value) => onControlChange(controlId, value)
              : undefined
          }
        />
      );
    }
  }

  return null;
}
