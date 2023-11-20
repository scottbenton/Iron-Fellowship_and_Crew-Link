import { GAME_SYSTEMS } from "types/GameSystems.type";
import { useGameSystemValue } from "./useGameSystemValue";
import { encodeContents } from "functions/dataswornIdEncoder";
import { useCallback } from "react";

export function useDataswornId() {
  const systemPrefix = useGameSystemValue({
    [GAME_SYSTEMS.IRONSWORN]: "ironsworn",
    [GAME_SYSTEMS.STARFORGED]: "starforged",
  });

  const getId = useCallback(
    (prefix: string, value: string) => {
      return `${systemPrefix}/${encodeContents(prefix)}/${encodeContents(
        value
      )}`;
    },
    [systemPrefix]
  );

  const getCustomIdPrefix = useCallback(
    (prefix: string) => {
      return `${systemPrefix}/${encodeContents(prefix)}/custom`;
    },
    [systemPrefix]
  );

  const getCustomId = useCallback(
    (prefix: string, value: string) => {
      return `${systemPrefix}/${encodeContents(prefix)}/custom/${encodeContents(
        value
      )}`;
    },
    [systemPrefix]
  );

  return {
    getId,
    getCustomIdPrefix,
    getCustomId,
  };
}
