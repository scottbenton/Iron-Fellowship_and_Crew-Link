import { useGameSystemValue } from "hooks/useGameSystemValue";
import { INITIATIVE_STATUS } from "types/Character.type";
import { GAME_SYSTEMS } from "types/GameSystems.type";

export function useInitiativeStatusText(shortVariants?: boolean) {
  return useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: {
      [INITIATIVE_STATUS.HAS_INITIATIVE]: "Has Initiative",
      [INITIATIVE_STATUS.DOES_NOT_HAVE_INITIATIVE]: shortVariants
        ? "No Initiative"
        : "Does not have Initiative",
      [INITIATIVE_STATUS.OUT_OF_COMBAT]: "Out of Combat",
    },
    [GAME_SYSTEMS.STARFORGED]: {
      [INITIATIVE_STATUS.HAS_INITIATIVE]: "In Control",
      [INITIATIVE_STATUS.DOES_NOT_HAVE_INITIATIVE]: "In a Bad Spot",
      [INITIATIVE_STATUS.OUT_OF_COMBAT]: "Out of Combat",
    },
  });
}
