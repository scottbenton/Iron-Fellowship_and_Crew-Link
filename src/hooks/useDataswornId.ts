import { GAME_SYSTEMS } from "types/GameSystems.type";
import { useGameSystemValue } from "./useGameSystemValue";

export function useDataswornId() {
  const systemPrefix = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: "ironsworn",
    [GAME_SYSTEMS.STARFORGED]: "starforged",
  });

  return {
    getId: (prefix: string, value: string) => {
      return `${systemPrefix}/${prefix}/${value}`;
    },
    getCustomIdPrefix: (prefix: string) => {
      return `${systemPrefix}/${prefix}/custom`;
    },
    getCustomId: (prefix: string, value: string) => {
      return `${systemPrefix}/${prefix}/custom/${value}`;
    },
  };
}
