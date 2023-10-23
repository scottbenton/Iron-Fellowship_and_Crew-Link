import { GAME_SYSTEMS } from "types/GameSystems.type";
import { useGameSystemValue } from "./useGameSystemValue";

export function useAppName() {
  return useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: "Iron Fellowship",
    [GAME_SYSTEMS.STARFORGED]: "Crew Link",
  });
}
