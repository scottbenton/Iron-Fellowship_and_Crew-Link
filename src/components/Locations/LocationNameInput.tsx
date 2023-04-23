import { SxProps } from "@mui/material";
import { TextFieldWithOracle } from "components/TextFieldWithOracle/TextFieldWithOracle";
import { useRoller } from "providers/DieRollProvider";
import { RefObject } from "react";

export interface LocationNameInputProps {
  name: string;
  setName: (name: string) => void;
  inputRef: RefObject<HTMLInputElement>;
}

const oracleTables = [
  "ironsworn/oracles/settlement/name/landscape_feature",
  "ironsworn/oracles/settlement/name/manmade_edifice",
  "ironsworn/oracles/settlement/name/creature",
  "ironsworn/oracles/settlement/name/historical_event",
  "ironsworn/oracles/settlement/name/old_world_language",
  "ironsworn/oracles/settlement/name/environmental_aspect",
  [
    "ironsworn/oracles/settlement/quick_name/prefix",
    "ironsworn/oracles/settlement/quick_name/suffix",
  ],
];

export function LocationNameInput(props: LocationNameInputProps) {
  const { name, setName, inputRef } = props;

  const { rollOracleTable } = useRoller();

  const handleGetOracleValue = () => {
    const oracleTable =
      oracleTables[Math.floor(Math.random() * oracleTables.length)];

    if (Array.isArray(oracleTable)) {
      return oracleTable
        .map((oracleId) => rollOracleTable(oracleId, false) ?? "")
        .join("");
    } else {
      return rollOracleTable(oracleTable, false) ?? "";
    }
  };

  return (
    <TextFieldWithOracle
      inputRef={inputRef}
      value={name}
      placeholder={"Location Name"}
      onChange={setName}
      getOracleValue={handleGetOracleValue}
      fullWidth
      variant={"standard"}
      sx={(theme) => ({ input: { ...theme.typography.h6 }, mx: 1 })}
    />
  );
}
