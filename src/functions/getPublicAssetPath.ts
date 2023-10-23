import { getSystem } from "hooks/useGameSystem";
import { GAME_SYSTEMS } from "types/GameSystems.type";

export function getPublicAssetPath(filename: string) {
  const system = getSystem();

  switch (system) {
    case GAME_SYSTEMS.STARFORGED:
      return `/assets/starforged/${filename}`;
    default:
      return `/assets/ironsworn/${filename}`;
  }
}
