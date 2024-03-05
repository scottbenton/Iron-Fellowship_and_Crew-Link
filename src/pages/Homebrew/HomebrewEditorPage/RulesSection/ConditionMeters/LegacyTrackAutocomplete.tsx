import {
  Autocomplete,
  Box,
  ListItemText,
  TextField,
  capitalize,
} from "@mui/material";
import { useStore } from "stores/store";

export interface LegacyTrackAutocompleteSingleProps {
  label?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  onBlur: () => void;
  helperText?: string;
  multiple?: false;
}

export interface LegacyTrackAutocompleteMultipleProps {
  label?: string;
  value?: string[];
  onChange: (value: string[] | undefined) => void;
  disabled?: boolean;
  onBlur: () => void;
  helperText?: string;
  multiple: true;
}

export type LegacyTrackAutocompleteProps =
  | LegacyTrackAutocompleteSingleProps
  | LegacyTrackAutocompleteMultipleProps;

export function LegacyTrackAutocomplete(props: LegacyTrackAutocompleteProps) {
  const { label, value, onChange, disabled, onBlur, helperText, multiple } =
    props;

  const legacyTrackMap = useStore((store) => store.rules.specialTracks);

  return (
    <Autocomplete
      options={Object.keys(legacyTrackMap)}
      getOptionKey={(option) => option}
      getOptionLabel={(key) => capitalize(legacyTrackMap[key]?.label)}
      renderInput={(params) => (
        <TextField
          {...params}
          helperText={helperText}
          label={label ?? "Legacy Tracks"}
        />
      )}
      renderOption={(props, option) => (
        <Box component={"li"} {...props}>
          <ListItemText primary={legacyTrackMap[option].label} />
        </Box>
      )}
      multiple={multiple}
      value={value ?? (multiple ? [] : null)}
      onChange={(evt, value) => {
        if (multiple && typeof value !== "string") {
          onChange(value ?? undefined);
        } else if (!multiple && !Array.isArray(value)) {
          onChange(value ?? undefined);
        }
      }}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
}
