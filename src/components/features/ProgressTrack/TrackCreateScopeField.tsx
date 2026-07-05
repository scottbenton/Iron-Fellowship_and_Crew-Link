import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

export interface TrackCreateScopeOption {
  value: string;
  label: string;
}

export interface TrackCreateScopeFieldProps {
  label: string;
  options: TrackCreateScopeOption[];
  value: string;
  onChange: (value: string) => void;
}

export function TrackCreateScopeField(props: TrackCreateScopeFieldProps) {
  const { label, options, value, onChange } = props;

  if (options.length < 2) {
    return null;
  }

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <RadioGroup
        row
        value={value}
        onChange={(evt) => onChange(evt.target.value)}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
