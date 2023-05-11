import { TextFieldWithOracle } from "components/TextFieldWithOracle/TextFieldWithOracle";
import { useDebouncedState } from "hooks/useDebouncedState";
import { useRoller } from "providers/DieRollProvider";

export interface DebouncedOracleInputProps {
  label: string;
  initialValue: string;
  updateValue: (value: string) => void;
  oracleTableId: string;
}

export function DebouncedOracleInput(props: DebouncedOracleInputProps) {
  const { label, initialValue, updateValue, oracleTableId } = props;

  const [value, setValue] = useDebouncedState(updateValue, initialValue);

  const { rollOracleTable } = useRoller();

  return (
    <TextFieldWithOracle
      label={label}
      value={value}
      onChange={setValue}
      getOracleValue={() => rollOracleTable(oracleTableId, false) ?? ""}
      fullWidth
    />
  );
}
