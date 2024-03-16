import { GAME_SYSTEMS } from "types/GameSystems.type";
import { useFeatureFlag } from "./useFeatureFlag";
import { useGameSystem } from "hooks/useGameSystem";

export function useNewSunderedIslesTheme() {
  const { gameSystem } = useGameSystem();
  return (
    useFeatureFlag("new-sundered-isles-theme") &&
    gameSystem === GAME_SYSTEMS.STARFORGED
  );
}
