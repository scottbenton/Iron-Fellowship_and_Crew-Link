import { Autocomplete, TextField, capitalize } from "@mui/material";
import { useRules } from "data/hooks/useRules";
import { StoredStat } from "types/HomebrewCollection.type";

export interface StatAutocompleteProps {
  stats: Record<string, StoredStat>;
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  onBlur: () => void;
}

export function StatAutocomplete(props: StatAutocompleteProps) {
  const { label, stats, value, onChange, disabled, onBlur } = props;
  const { stats: baseStats } = useRules();

  const allStats = { ...stats, ...baseStats };

  return (
    <Autocomplete
      multiple={true}
      options={Object.keys(allStats)}
      getOptionLabel={(statKey) => capitalize(allStats[statKey].label)}
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
