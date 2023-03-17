export interface StoredOracle {
  $id: string;
  name: string;
  text: string;
  table: {
    roll: number;
    result: string;
  }[];
}

export interface OracleDocument {
  oracles: { [moveId: string]: StoredOracle };
  oracleOrder: string[];
}

export const customOracleCategoryPrefix = "ironsworn/oracles/custom";

export enum TableColumnType {
  Range = "dice range",
  String = "string",
}
