import { GAME_SYSTEMS } from "types/GameSystems.type";

export const activeFeatureFlags: {
  testId: string;
  label: string;
  warning?: string;
  gameSystems?: GAME_SYSTEMS[];
}[] = [
  {
    testId: "lodestar",
    label: "Ironsworn: Lodestar",
    gameSystems: [GAME_SYSTEMS.IRONSWORN],
  },
];
