import { TextFieldProps } from "@mui/material";
import { TextFieldWithOracle } from "components/shared/TextFieldWithOracle/TextFieldWithOracle";
import { useDebouncedState } from "hooks/useDebouncedState";
import { useRoller } from "stores/appState/useRoller";
import { useStore } from "stores/store";

export type DebouncedOracleInputProps = Omit<TextFieldProps, "onChange"> & {
  initialValue: string;
  updateValue: (value: string) => void;
  oracleTableId: string | string[] | (string | string[])[] | undefined;
  joinOracleTables?: boolean;
};

export function DebouncedOracleInput(props: DebouncedOracleInputProps) {
  const {
    initialValue,
    updateValue,
    oracleTableId,
    joinOracleTables,
    ...textFieldProps
  } = props;

  const [value, setValue] = useDebouncedState(updateValue, initialValue);

  const { rollOracleTable } = useRoller();

  const oracleMap = useStore(
    (store) => store.rules.oracleMaps.oracleRollableMap
  );

  const doesOracleExist =
    Array.isArray(oracleTableId) ||
    (!!oracleTableId && oracleTableId in oracleMap);

  const handleOracleRoll = async () => {
    if (!oracleTableId) return "";
    if (Array.isArray(oracleTableId) && joinOracleTables) {
      const oracleResults: string[] = [];
      for(const tableId of oracleTableId) {
        if (Array.isArray(tableId)) {
          const tableResults: string[] = [];
          for(const id of tableId) {
            const result = await rollOracleTable(id, false);
            tableResults.push(result?.result ?? "");
          }
          oracleResults.push(tableResults.join(""));
        } else {
          const result = await rollOracleTable(tableId, false);
          oracleResults.push(result?.result ?? "");
        }
      }

      return oracleResults.join(" ");
    } else if (Array.isArray(oracleTableId)) {
      const oracleIndex = Math.floor(Math.random() * oracleTableId.length);
      const oracleId = oracleTableId[oracleIndex];
      if (Array.isArray(oracleId)) {
        const results: string[] = [];
        for(const id of oracleId) {
          const result = await rollOracleTable(id, false);
          results.push(result?.result ?? "");
        }
        return results.join("");
      }

      const result = await rollOracleTable(oracleId, false);
      return result?.result ?? "";
    }

    const result = await rollOracleTable(oracleTableId, false);
    return result?.result ?? "";
  };

  return (
    <TextFieldWithOracle
      value={value}
      onChange={setValue}
      getOracleValue={doesOracleExist ? () => handleOracleRoll() : undefined}
      fullWidth
      {...textFieldProps}
    />
  );
}
