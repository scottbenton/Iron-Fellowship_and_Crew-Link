import { MoveStatKeys } from "./stats.enum";

export interface StoredMove {
  $id: string;
  name: string;
  stats?: MoveStatKeys[];
  text: string;
  oracleIds?: string[];
}

export interface MoveDocument {
  moves: { [moveId: string]: StoredMove };
  moveOrder: string[];
}

export const customMoveCategoryPrefix = "/ironsworn/moves/custom";
