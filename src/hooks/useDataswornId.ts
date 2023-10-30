import { GAME_SYSTEMS } from "types/GameSystems.type";
import { useGameSystemValue } from "./useGameSystemValue";
import { encodeContents } from "functions/dataswornIdEncoder";

export function useDataswornId() {
  const systemPrefix = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: "ironsworn",
    [GAME_SYSTEMS.STARFORGED]: "starforged",
  });

  return {
    getId: (prefix: string, value: string) => {
      return `${systemPrefix}/${encodeContents(prefix)}/${encodeContents(
        value
      )}`;
    },
    getCustomIdPrefix: (prefix: string) => {
      return `${systemPrefix}/${encodeContents(prefix)}/custom`;
    },
    getCustomId: (prefix: string, value: string) => {
      return `${systemPrefix}/${encodeContents(prefix)}/custom/${encodeContents(
        value
      )}`;
    },
  };
}
