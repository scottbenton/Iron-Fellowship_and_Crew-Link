import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";

export interface TrackCreateScopeFieldProps {
  label: string;
  checked: boolean;
  helperText: string;
  onChange: (checked: boolean) => void;
}

export function TrackCreateScopeField(props: TrackCreateScopeFieldProps) {
  const { label, checked, helperText, onChange } = props;

  return (
    <FormControl>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(_, nextChecked) => onChange(nextChecked)}
          />
        }
        label={label}
      />
      <FormHelperText sx={{ mt: 0 }}>{helperText}</FormHelperText>
    </FormControl>
  );
}
