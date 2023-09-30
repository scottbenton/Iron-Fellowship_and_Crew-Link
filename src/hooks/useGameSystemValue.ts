import { GameSystemChooser } from "types/GameSystems.type";
import { useGameSystem } from "./useGameSystem";

export function useGameSystemValue<T>(values: GameSystemChooser<T>): T {
  const { gameSystem } = useGameSystem();

  return values[gameSystem];
}
