import { Autocomplete, Box, ListItemText, TextField } from "@mui/material";
import { useOracleTableRollableMap } from "data/hooks/useOracleTableRollableMap";

export interface OracleTableRollableAutocompleteProps {
  homebrewId: string;
  label?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  onBlur: () => void;
  helperText?: string;
}

export function OracleTableRollableAutocomplete(
  props: OracleTableRollableAutocompleteProps
) {
  const { homebrewId, label, value, onChange, disabled, onBlur, helperText } =
    props;

  const oracleTableRollableMap = useOracleTableRollableMap([homebrewId]);

  return (
    <Autocomplete
      options={Object.keys(oracleTableRollableMap)}
      getOptionKey={(option) => option}
      getOptionLabel={(key) => oracleTableRollableMap[key]?.name}
      renderInput={(params) => (
        <TextField
          {...params}
          helperText={helperText}
          label={label ?? "Oracle Tables"}
        />
      )}
      renderOption={(props, option) => (
        <Box component={"li"} {...props}>
          <ListItemText
            primary={oracleTableRollableMap[option].name}
            secondary={oracleTableRollableMap[option].id}
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
