import { TextField } from "@mui/material";
import { useState } from "react";

export interface AssetCardFieldProps {
  label: string;
  value?: string;
  onChange?: (newValue: string) => Promise<boolean>;
  disabled: boolean;
}

export function AssetCardField(props: AssetCardFieldProps) {
  const { label, value, onChange, disabled } = props;

  const [localValue, setLocalValue] = useState<string>(value ?? "");

  return (
    <TextField
      label={label}
      value={localValue}
      variant={"standard"}
      fullWidth
      disabled={disabled}
      onChange={(evt) => setLocalValue(evt.target.value)}
      onBlur={(evt) => onChange && onChange(evt.target.value)}
    />
  );
}
