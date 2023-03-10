import { MoveStatKeys } from "./stats.enum";

export interface StoredMove {
  name: string;
  stats?: MoveStatKeys[];
  text: string;
  oracleId?: string;
}

export interface MoveDocument {
  moves: { [moveId: string]: StoredMove };
  moveOrder: string[];
}

export function getCustomMoveDatabaseId(moveName: string) {
  return `custom-${moveName.toLocaleLowerCase().replaceAll(" ", "-")}`;
}

export const customMoveCategoryId = "ironsworn/moves/custom";

export function getCustomMoveDataswornId(moveName: string) {
  return `${customMoveCategoryId}/${getCustomMoveDatabaseId(moveName)}`;
}
