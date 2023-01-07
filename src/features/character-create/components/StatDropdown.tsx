import { MenuItem, TextField } from "@mui/material";

export interface StatDropdownProps {
  value: number | undefined;
  onChange: (newValue: number | undefined) => void;

  label: string;
  remainingOptions: number[];
}

export function StatDropdown(props: StatDropdownProps) {
  const { value, onChange, label, remainingOptions } = props;

  const handleChange = (value: string | number) => {
    if (typeof value === "number" && value > 0 && value <= 3) {
      onChange(value);
    } else {
      onChange(undefined);
    }
  };

  return (
    <TextField
      label={label}
      id={label}
      select
      variant={"outlined"}
      value={value ?? -1}
      onChange={(evt) => handleChange(evt.target.value)}
      sx={{ width: 100, marginRight: 1 }}
    >
      <MenuItem value={-1}></MenuItem>
      {value !== undefined && <MenuItem value={value}>{value}</MenuItem>}
      {remainingOptions.map((option, index) => (
        <MenuItem value={option} key={index}>
          {option + ""}
        </MenuItem>
      ))}
    </TextField>
  );
}
