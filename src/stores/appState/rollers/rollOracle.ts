import {
  OracleColumnDetails,
  OracleColumnSimple,
  OracleRollable,
  OracleTableDetails,
  OracleTableRowDetails,
  OracleTableRowSimple,
  OracleTableSharedDetails,
  OracleTableSharedResults,
  OracleTableSharedRolls,
  OracleTableSimple,
  OracleTablesCollection,
} from "@datasworn/core";
import { OracleTableRoll, ROLL_TYPE } from "types/DieRolls.type";
import { rollDie } from "./rollDie";

function rollOracleColumn(
  column:
    | OracleColumnSimple
    | OracleColumnDetails
    | OracleTableSimple
    | OracleTableDetails
):
  | { roll: number; result: OracleTableRowSimple | OracleTableRowDetails }
  | undefined {
  const roll = rollDie(column.dice);
  if (!roll) {
    return undefined;
  }
  const result = column.rows.find(
    (row) => row.min && row.max && row.min <= roll && row.max >= roll
  );
  if (!result) {
    console.error("Could not find result for roll", roll);
    return undefined;
  }

  return {
    roll,
    result,
  };
}

export function rollOracle(
  oracle:
    | OracleRollable
    | OracleTableSharedRolls
    | OracleTableSharedResults
    | OracleTableSharedDetails
    | OracleTablesCollection,
  characterId: string | null,
  uid: string,
  gmsOnly: boolean
): OracleTableRoll | undefined {
  // We cannot roll across multiple tables like this
  if (oracle.oracle_type === "tables") {
    console.error("Oracle table collections cannot be rolled");
    return undefined;
  } else if (
    oracle.oracle_type === "table_shared_results" ||
    oracle.oracle_type === "table_shared_details"
  ) {
    console.error(
      "Shared Results tables cannot be rolled - please specify a contents table to roll instead."
    );
    return undefined;
  }

  let resultString: string | undefined = undefined;
  let rolls: number | number[] | undefined = undefined;

  if (oracle.oracle_type === "table_shared_rolls") {
    const tmpRolls: number[] = [];
    resultString = Object.values(oracle.contents ?? {})
      .sort((c1, c2) => c1.name.localeCompare(c2.name))
      .map((col) => {
        const rollResult = rollOracleColumn(col);
        if (!rollResult) {
          return "";
        } else {
          tmpRolls.push(rollResult.roll);
          return `* ${col.name}: ${rollResult.result.result}`;
        }
      })
      .join("\n");
    rolls = tmpRolls;
  } else {
    const rollResult = rollOracleColumn(oracle);
    console.debug(rollResult);
    if (rollResult) {
      rolls = rollResult.roll;
      resultString = rollResult.result.result;
    }
  }

  if (resultString && rolls !== undefined) {
    return {
      type: ROLL_TYPE.ORACLE_TABLE,
      rollLabel: oracle.name,
      timestamp: new Date(),
      characterId,
      uid,
      gmsOnly,
      roll: rolls,
      result: resultString,
    };
  }

  return undefined;
}
