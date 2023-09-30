import { TextFieldProps } from "@mui/material";
import { TextFieldWithOracle } from "components/shared/TextFieldWithOracle/TextFieldWithOracle";
import { useDebouncedState } from "hooks/useDebouncedState";
import { useRoller } from "providers/DieRollProvider";

export type DebouncedOracleInputProps = Omit<TextFieldProps, "onChange"> & {
  initialValue: string;
  updateValue: (value: string) => void;
  oracleTableId: string | string[];
};

export function DebouncedOracleInput(props: DebouncedOracleInputProps) {
  const { initialValue, updateValue, oracleTableId, ...textFieldProps } = props;

  const [value, setValue] = useDebouncedState(updateValue, initialValue);

  const { rollOracleTable } = useRoller();

  const handleOracleRoll = () => {
    if (Array.isArray(oracleTableId)) {
      const oracleIndex = Math.floor(Math.random() * oracleTableId.length);
      return rollOracleTable(oracleTableId[oracleIndex], false) ?? "";
    }
    return rollOracleTable(oracleTableId, false) ?? "";
  };

  return (
    <TextFieldWithOracle
      value={value}
      onChange={setValue}
      getOracleValue={() => handleOracleRoll()}
      fullWidth
      {...textFieldProps}
    />
  );
}
