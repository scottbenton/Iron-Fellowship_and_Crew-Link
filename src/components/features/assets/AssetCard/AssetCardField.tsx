import { MenuItem, TextField } from "@mui/material";
import { useState } from "react";
import { InputType } from "types/Datasworn";
import { FieldType } from "./FieldType";

export interface AssetCardFieldProps {
  field: FieldType;
  value?: string;
  onChange?: (newValue: string) => Promise<void>;
  disabled: boolean;
}

export function AssetCardField(props: AssetCardFieldProps) {
  const { field, value, onChange, disabled } = props;

  const [localValue, setLocalValue] = useState<string>(value ?? "");

  if (field["Input type"] === InputType.Text) {
    return (
      <TextField
        label={field.Label}
        value={localValue}
        variant={"standard"}
        fullWidth
        disabled={disabled}
        onChange={(evt) => setLocalValue(evt.target.value)}
        onBlur={(evt) => onChange && onChange(evt.target.value)}
      />
    );
  }

  if (field["Input type"] === InputType.Select) {
    return (
      <TextField
        select
        label={field.Label}
        value={value ?? ""}
        variant={"standard"}
        fullWidth
        disabled={disabled}
        onChange={(evt) => onChange && onChange(evt.target.value)}
      >
        {Object.values(field.Options).map((option) => (
          <MenuItem key={option.$id} value={option.$id}>
            {option.Label}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  return null;
}
