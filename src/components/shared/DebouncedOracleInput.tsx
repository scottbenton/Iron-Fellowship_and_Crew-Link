import { TextFieldProps } from "@mui/material";
import { TextFieldWithOracle } from "components/shared/TextFieldWithOracle/TextFieldWithOracle";
import { oracleMap } from "data/oracles";
import { useDebouncedState } from "hooks/useDebouncedState";
import { useRoller } from "providers/DieRollProvider";
import { useRef } from "react";

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
  const hasUnsavedChanges = useRef(false);

  const { rollOracleTable } = useRoller();

  const doesOracleExist =
    Array.isArray(oracleTableId) ||
    (!!oracleTableId && oracleTableId in oracleMap);

  const handleOracleRoll = () => {
    if (!oracleTableId) return "";
    if (Array.isArray(oracleTableId) && joinOracleTables) {
      return oracleTableId
        .map((tableId) => {
          if (Array.isArray(tableId)) {
            return tableId
              .map((id) => rollOracleTable(id, false) ?? "")
              .join("");
          }
          return rollOracleTable(tableId, false) ?? "";
        })
        .join(" ");
    } else if (Array.isArray(oracleTableId)) {
      const oracleIndex = Math.floor(Math.random() * oracleTableId.length);
      const oracleId = oracleTableId[oracleIndex];
      if (Array.isArray(oracleId)) {
        return oracleId.map((id) => rollOracleTable(id, false) ?? "").join("");
      }
      return rollOracleTable(oracleId, false) ?? "";
    }

    return rollOracleTable(oracleTableId, false) ?? "";
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
