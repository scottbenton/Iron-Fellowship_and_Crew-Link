export interface JsonOracleTable {
  Chance: number;
  Description: string;
}
export interface JsonOracle {
  Title: string;
  Oracles: {
    Name: string;
    "Oracle Table"?: JsonOracleTable[];
    Oracles?: {
      Name: string;
      "Oracle Table": JsonOracleTable[];
    }[];
  }[];
}

export type OracleTable = {
  chance: number;
  description: string;
}[];

export type OracleSection = {
  sectionName: string;
  table: OracleTable;
};

export interface Oracle {
  name: string;
  sections: OracleSection[];
}
