export interface HomebrewOracleCollection {
  label: string;
  tables: string[];
  subCollectionIds: string[];
  description?: string;
  enhancesId?: string;
  replacesId?: string;
}

export interface HomebrewOracleTable {
  label: string;
  description?: string;
  replaces?: string;
  diceExpression: string;
  columnLabels: {
    roll: string;
    result: string;
    detail?: string;
  };
  rows: {
    result: string;
    min?: number;
    max?: number;
    detail?: string;
  }[];
}
