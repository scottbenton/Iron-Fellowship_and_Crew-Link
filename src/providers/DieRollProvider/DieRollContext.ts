import { createContext } from "react";
import { OracleTable } from "types/Oracles.type";

export enum ROLL_RESULT {
  HIT,
  WEAK_HIT,
  MISS,
}

export enum ROLL_TYPE {
  STAT,
  ORACLE,
  ORACLE_TABLE,
}

export enum ORACLE_ROLL_CHANCE {
  SMALL_CHANCE,
  UNLIKELY,
  FIFTY_FIFTY,
  LIKELY,
  ALMOST_CERTAIN,
}

export const oracleRollChanceNames: { [key in ORACLE_ROLL_CHANCE]: string } = {
  [ORACLE_ROLL_CHANCE.ALMOST_CERTAIN]: "Almost Certain",
  [ORACLE_ROLL_CHANCE.LIKELY]: "Likely",
  [ORACLE_ROLL_CHANCE.FIFTY_FIFTY]: "50/50",
  [ORACLE_ROLL_CHANCE.UNLIKELY]: "Unlikely",
  [ORACLE_ROLL_CHANCE.SMALL_CHANCE]: "Small Chance",
};

export interface BaseRoll {
  type: ROLL_TYPE;
  rollLabel: string;
  timestamp: Date;
}
export interface StatRoll extends BaseRoll {
  type: ROLL_TYPE.STAT;
  action: number;
  challenge1: number;
  challenge2: number;
  modifier?: number;
  result: ROLL_RESULT;
}

export interface OracleRoll extends BaseRoll {
  type: ROLL_TYPE.ORACLE;
  roll: number;
  result: string;
  chance: ORACLE_ROLL_CHANCE;
}

export interface OracleTableRoll extends BaseRoll {
  type: ROLL_TYPE.ORACLE_TABLE;
  roll: number;
  result: string;
  oracleName?: string;
}

export type Roll = StatRoll | OracleRoll | OracleTableRoll;

export interface IDieRollContext {
  rolls: Roll[];
  rollStat: (rollLabel: string, modifier?: number) => ROLL_RESULT;
  rollOracle: (rollChance: ORACLE_ROLL_CHANCE) => boolean;
  rollOracleTable: (
    oracleName: string | undefined,
    sectionName: string,
    oracleTable: OracleTable
  ) => string;
}

export const DieRollContext = createContext<IDieRollContext>({
  rolls: [],
  rollStat: () => ROLL_RESULT.MISS,
  rollOracle: () => false,
  rollOracleTable: () => "",
});
