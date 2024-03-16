import { useGameSystem } from "hooks/useGameSystem";
import { useFeatureFlag } from "./useFeatureFlag";
import { GAME_SYSTEMS } from "types/GameSystems.type";

export function useNewCrewLinkTheme() {
  const { gameSystem } = useGameSystem();
  return (
    useFeatureFlag("new-crew-link-theme") &&
    gameSystem === GAME_SYSTEMS.STARFORGED
  );
}
