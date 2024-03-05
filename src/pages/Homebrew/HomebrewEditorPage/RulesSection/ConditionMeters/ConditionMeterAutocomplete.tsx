import { Autocomplete, TextField, capitalize } from "@mui/material";
import { useStore } from "stores/store";

export interface ConditionMeterAutocompleteProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  onBlur: () => void;
}

export function ConditionMeterAutocomplete(
  props: ConditionMeterAutocompleteProps
) {
  const { label, value, onChange, disabled, onBlur } = props;

  const conditionMeters = useStore((store) => store.rules.conditionMeters);

  return (
    <Autocomplete
      multiple={true}
      options={Object.keys(conditionMeters)}
      getOptionLabel={(key) => capitalize(conditionMeters[key].label)}
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
