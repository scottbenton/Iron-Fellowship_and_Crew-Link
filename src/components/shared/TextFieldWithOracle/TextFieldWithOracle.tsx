import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
  Tooltip,
} from "@mui/material";
import RollIcon from "@mui/icons-material/Casino";
import { useStore } from "stores/store";

export type TextFieldWithOracleProps = Omit<TextFieldProps, "onChange"> & {
  getOracleValue: (() => string) | undefined;
  onChange: (value: string) => void;
};

export function TextFieldWithOracle(props: TextFieldWithOracleProps) {
  const { getOracleValue, onChange, label, ...textFieldProps } = props;

  const announce = useStore((store) => store.appState.announce);

  const handleOracleRoll = () => {
    if (getOracleValue) {
      const value = getOracleValue();
      onChange(value);
      announce(`Updated ${label} to ${value}`);
    }
  };

  return (
    <TextField
      label={label}
      fullWidth
      {...textFieldProps}
      onChange={(evt) => onChange(evt.currentTarget.value)}
      InputProps={{
        endAdornment: getOracleValue ? (
          <InputAdornment position={"end"}>
            <Tooltip title={"Consult the Oracle"} enterDelay={500}>
              <IconButton onClick={() => handleOracleRoll()}>
                <RollIcon />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ) : undefined,
      }}
    />
  );
}
