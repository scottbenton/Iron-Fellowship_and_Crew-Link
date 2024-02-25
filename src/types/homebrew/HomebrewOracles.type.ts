export interface StoredOracleCollection {
  collectionId: string; // Homebrew collection id
  label: string;
  parentOracleCollectionId?: string;
  description?: string;
  enhancesId?: string;
  replacesId?: string;
}

export interface StoredOracleTable {
  collectionId: string; // Homebrew Collection ID
  oracleCollectionId: string; // Parent collection ID
  label: string;
  description?: string;
  replaces?: string;
  columnLabels: {
    roll: string;
    result: string;
    detail?: string;
  };
  rows: {
    result: string;
    chance: number;
    detail?: string;
  }[];
}
