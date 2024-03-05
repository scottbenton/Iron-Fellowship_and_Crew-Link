import { Autocomplete, Box, ListItemText, TextField } from "@mui/material";
import { useStore } from "stores/store";

export interface MoveAutocompleteProps {
  label?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  onBlur: () => void;
  helperText?: string;
}

export function MoveAutocomplete(props: MoveAutocompleteProps) {
  const { label, value, onChange, disabled, onBlur, helperText } = props;

  const moveMap = useStore((store) => store.rules.moveMaps.moveMap);

  return (
    <Autocomplete
      options={Object.keys(moveMap)}
      getOptionKey={(option) => option}
      getOptionLabel={(key) => moveMap[key]?.name}
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
            primary={moveMap[option].name}
            secondary={moveMap[option].id}
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
