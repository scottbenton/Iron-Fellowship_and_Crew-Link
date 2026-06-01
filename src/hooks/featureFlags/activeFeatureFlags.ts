import { GAME_SYSTEMS } from "types/GameSystems.type";

export const activeFeatureFlags: {
  testId: string;
  label: string;
  warning?: string;
  gameSystems?: GAME_SYSTEMS[];
}[] = [
  {
    testId: "lodestar",
    label: "Enable Lodestar content (may not match book content)",
    gameSystems: [GAME_SYSTEMS.IRONSWORN],
  },
];
