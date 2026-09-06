import { Datasworn } from "@datasworn-community/core";
import { OracleTableRoll, ROLL_TYPE } from "types/DieRolls.type";
import { rollDie } from "./rollDie";
import { Theme } from "@mui/material";

async function rollOracleColumn(column: Datasworn.OracleRollable, theme: Theme, hide3dDice: boolean):
  Promise<| {
    roll: number;
    result: Datasworn.OracleRollableRow;
  }
    | undefined> {
  const roll = await rollDie(column.dice, theme, hide3dDice);
  if (!roll) {
    return undefined;
  }
  const result = column.rows.find(
    (row) => row.roll && row.roll.min <= roll && row.roll.max >= roll
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

export async function rollOracle(
  oracle: Datasworn.OracleCollection | Datasworn.OracleRollable,
  characterId: string | null,
  uid: string,
  gmsOnly: boolean,
  theme: Theme,
  hide3dDice: boolean,
): Promise<OracleTableRoll | undefined> {
  // We cannot roll across multiple tables like this
  if (oracle.oracle_type === "tables") {
    console.error("Oracle table collections cannot be rolled");
    return undefined;
  } else if (
    oracle.oracle_type === "table_shared_text" ||
    oracle.oracle_type === "table_shared_text2" ||
    oracle.oracle_type === "table_shared_text3"
  ) {
    console.error(
      "Shared Results tables cannot be rolled - please specify a contents table to roll instead."
    );
    return undefined;
  }

  let resultString: string | undefined = undefined;
  let rolls: number | number[] | undefined = undefined;
  let result2: string | undefined = undefined;
  let result3: string | undefined = undefined;

  if (oracle.oracle_type === "table_shared_rolls") {
    const tmpRolls: number[] = [];
    resultString = Object.values(oracle.contents ?? {})
      .sort((c1, c2) => c1.name.localeCompare(c2.name))
      .map(async (col) => {
        const rollResult = await rollOracleColumn(col, theme, hide3dDice);
        if (!rollResult) {
          return "";
        } else {
          tmpRolls.push(rollResult.roll);
          return `* ${col.name}: ${rollResult.result.text}`;
        }
      })
      .join("\n");
    rolls = tmpRolls;
  } else {
    const rollResult = await rollOracleColumn(oracle, theme, hide3dDice);
    if (rollResult) {
      rolls = rollResult.roll;
      resultString = rollResult.result.text;
      if (
        oracle.oracle_type === "table_text2" ||
        oracle.oracle_type === "table_text3"
      ) {
        const columnLabel2 = oracle.column_labels.text2;
        const text2 = (rollResult.result as Datasworn.OracleRollableRowText2)
          .text2;
        const columnLabel3 = (oracle as Datasworn.OracleTableText3)
          .column_labels.text3;
        const text3 = (rollResult.result as Datasworn.OracleRollableRowText3)
          .text3;

        if (text2) {
          result2 = columnLabel2 ? `${columnLabel2}: ${text2}` : text2;
        }
        if (text3) {
          result3 = columnLabel3 ? `${columnLabel3}: ${text3}` : text3;
        }
      }
    }
  }

  if (resultString && rolls !== undefined) {
    const roll: OracleTableRoll = {
      type: ROLL_TYPE.ORACLE_TABLE,
      rollLabel: oracle.name,
      timestamp: new Date(),
      characterId,
      uid,
      gmsOnly,
      roll: rolls,
      result: resultString,
      oracleId: oracle._id,
    };

    if (result2) {
      roll.text2 = result2;
    }
    if (result3) {
      roll.text3 = result3;
    }

    return roll;
  }

  return undefined;
}
