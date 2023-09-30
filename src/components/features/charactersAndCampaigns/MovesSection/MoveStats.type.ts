import type { PlayerConditionMeter, Stat } from "types/stats.enum";

export interface MoveStats {
  [Stat.Edge]: number;
  [Stat.Heart]: number;
  [Stat.Iron]: number;
  [Stat.Wits]: number;
  [Stat.Shadow]: number;
  [PlayerConditionMeter.Health]: number;
  [PlayerConditionMeter.Spirit]: number;
  [PlayerConditionMeter.Supply]: number;
  companionHealth: { companionName: string; health: number }[];
}
