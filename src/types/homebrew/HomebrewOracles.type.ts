import { DiceExpression, OracleDuplicateBehavior } from "@datasworn/core";

/** ORACLE ROLLS */

export interface StoredOracleRoll {
  oracleId: string | null;
  auto: boolean;
  duplicates: OracleDuplicateBehavior;
  dice: DiceExpression | null;
  numberOfRolls: number;
}

export interface StoredOracleTableBase {
  id: string;
  name: string;
  result: string;
  oracleRolls?: StoredOracleRoll;
  min: number | null;
  max: number | null;
}

export interface StoredOracleTableSimple extends StoredOracleTableBase {}

export interface StoredOracleTableDetails extends StoredOracleTableBase {
  detail: string;
}

export type StoredOracleTableRollable =
  | StoredOracleTableSimple
  | StoredOracleTableDetails;

/** ORACLE COLUMNS */

export interface StoredOracleColumnSimple {
  id: string;
  type: "column_simple";
  name: string;
  summary?: string;
  columnLabels: {
    roll: string;
    result: string;
  };
  replaces?: string;
  dice: string;
}

/** ORACLE TABLES */

export type StoredOracleCollection =
  | StoredOracleTablesCollection
  | StoredOracleTableSharedRolls
  | StoredOracleTableSharedResults
  | StoredOracleTableSharedDetails;

interface BaseStoredOracleCollection {
  id: string;
  type: "tables" | "table_shared_rolls";
  name: string;
  description?: string;
  enhances?: string;
  replaces?: string;
}

export interface StoredOracleTableSharedRolls
  extends BaseStoredOracleCollection {
  type: "table_shared_rolls";
  contents: { [key: string]: StoredOracleColumnSimple };
  column_labels: {
    roll: string;
  };
}

export interface StoredOracleTableSharedResults {}

export interface StoredOracleTableSharedDetails {}

export interface StoredOracleTablesCollection
  extends BaseStoredOracleCollection {
  type: "tables";
  contents?: { [key: string]: StoredOracleTableRollable };
  collections?: { [key: string]: StoredOracleCollection };
}
