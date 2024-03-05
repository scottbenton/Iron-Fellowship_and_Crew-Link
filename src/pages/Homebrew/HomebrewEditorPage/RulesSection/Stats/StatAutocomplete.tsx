import { Autocomplete, TextField, capitalize } from "@mui/material";
import { useStore } from "stores/store";

export interface StatAutocompleteProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  onBlur: () => void;
}

export function StatAutocomplete(props: StatAutocompleteProps) {
  const { label, value, onChange, disabled, onBlur } = props;

  const stats = useStore((store) => store.rules.stats);

  return (
    <Autocomplete
      multiple={true}
      options={Object.keys(stats)}
      getOptionLabel={(statKey) => capitalize(stats[statKey].label)}
      renderInput={(params) => (
        <TextField {...params} label={label ?? "Stats"} />
      )}
      value={value}
      onChange={(evt, value) => {
        const ids = Array.isArray(value) ? value : [];
        onChange(ids);
      }}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
}
