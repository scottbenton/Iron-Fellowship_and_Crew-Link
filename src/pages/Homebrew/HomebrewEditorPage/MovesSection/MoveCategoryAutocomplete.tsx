import { Autocomplete, Box, ListItemText, TextField } from "@mui/material";
import { useStore } from "stores/store";

export interface MoveCategoryAutocompleteProps {
  label?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  onBlur: () => void;
  helperText?: string;
}

export function MoveCategoryAutocomplete(props: MoveCategoryAutocompleteProps) {
  const { label, value, onChange, disabled, onBlur, helperText } = props;

  const moveCategoryMap = useStore(
    (store) => store.rules.moveMaps.moveCategoryMap
  );

  return (
    <Autocomplete
      options={Object.keys(moveCategoryMap)}
      getOptionKey={(option) => option}
      getOptionLabel={(key) => moveCategoryMap[key]?.name}
      renderInput={(params) => (
        <TextField
          {...params}
          helperText={helperText}
          label={label ?? "Move Categories"}
        />
      )}
      renderOption={(props, option) => (
        <Box component={"li"} {...props}>
          <ListItemText
            primary={moveCategoryMap[option].name}
            secondary={moveCategoryMap[option].id}
          />
        </Box>
      )}
      value={value ?? null}
      onChange={(evt, value) => {
        onChange(value ?? undefined);
      }}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
}
