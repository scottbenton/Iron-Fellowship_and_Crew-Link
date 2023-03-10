export enum STATS {
  EDGE = "edge",
  HEART = "heart",
  IRON = "iron",
  SHADOW = "shadow",
  WITS = "wits",
}

export enum Stat {
  Edge = "edge",
  Heart = "heart",
  Iron = "iron",
  Shadow = "shadow",
  Wits = "wits",
}

export enum PlayerConditionMeter {
  Health = "health",
  Spirit = "spirit",
  Supply = "supply",
}

export type StatKeys = keyof typeof Stat;
export type PlayerConditionMeterKeys = keyof typeof PlayerConditionMeter;

export type MoveStatKeys = Stat | PlayerConditionMeter | "companion health";

export type MoveStats = {
  [stat in StatKeys]: number;
} & {
  [conditionMeter in PlayerConditionMeterKeys]: number;
} & {
  companionHealth: { companionName: string; health: number }[];
};
