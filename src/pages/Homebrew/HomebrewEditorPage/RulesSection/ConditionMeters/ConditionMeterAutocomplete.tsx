import { Autocomplete, TextField, capitalize } from "@mui/material";
import { useRules } from "data/hooks/useRules";
import { StoredConditionMeter } from "types/homebrew/HomebrewRules.type";

export interface StatAutocompleteProps {
  conditionMeters: Record<string, StoredConditionMeter>;
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  onBlur: () => void;
}

export function ConditionMeterAutocomplete(props: StatAutocompleteProps) {
  const { label, conditionMeters, value, onChange, disabled, onBlur } = props;
  const { condition_meters: baseConditionMeters } = useRules();

  const allConditionMeters = { ...conditionMeters, ...baseConditionMeters };

  return (
    <Autocomplete
      multiple={true}
      options={Object.keys(allConditionMeters)}
      getOptionLabel={(key) => capitalize(allConditionMeters[key].label)}
      renderInput={(params) => (
        <TextField {...params} label={label ?? "Condition Meters"} />
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
