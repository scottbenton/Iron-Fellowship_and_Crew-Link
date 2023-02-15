import { STATS } from "./stats.enum";

export enum ROLLABLE_TRACKS {
  HEALTH = "health",
  SPIRIT = "spirit",
  SUPPLY = "supply",
}

export type ROLLABLES = STATS | ROLLABLE_TRACKS;

export interface MoveOracle {
  table: {
    chance: number;
    description: string;
  }[];
}

export interface Move {
  name: string;
  stats?: ROLLABLES[];
  text: string;
  oracle?: MoveOracle;
}

export interface MoveCategory {
  categoryName: string;
  moves: Move[];
}

export type Moves = MoveCategory[];
