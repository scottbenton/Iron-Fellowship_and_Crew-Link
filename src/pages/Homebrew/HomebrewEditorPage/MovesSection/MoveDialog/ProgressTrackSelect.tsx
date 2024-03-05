import { MenuItem, TextField } from "@mui/material";
import { useStore } from "stores/store";

export interface ProgressTrackSelectProps {
  label?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  onBlur: () => void;
  helperText?: string;
}

export function ProgressTrackSelect(props: ProgressTrackSelectProps) {
  const { label, value, onChange, disabled, onBlur, helperText } = props;

  const progressTracks = useStore((store) => store.rules.progressTracks);

  return (
    <TextField
      select
      value={value ?? ""}
      onChange={(evt) => {
        onChange(evt.target.value);
      }}
      onBlur={onBlur}
      disabled={disabled}
      label={label ?? "Progress Track Category"}
      helperText={helperText}
    >
      {progressTracks.map((track) => (
        <MenuItem key={track} value={track}>
          {track}
        </MenuItem>
      ))}
    </TextField>
  );
}
