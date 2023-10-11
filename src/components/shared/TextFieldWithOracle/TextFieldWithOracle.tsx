import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
  Tooltip,
} from "@mui/material";
import RollIcon from "@mui/icons-material/Casino";

export type TextFieldWithOracleProps = Omit<TextFieldProps, "onChange"> & {
  getOracleValue: (() => string) | undefined;
  onChange: (value: string) => void;
};

export function TextFieldWithOracle(props: TextFieldWithOracleProps) {
  const { getOracleValue, onChange, ...textFieldProps } = props;

  const handleOracleRoll = () => {
    if (getOracleValue) {
      onChange(getOracleValue());
    }
  };

  return (
    <TextField
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
