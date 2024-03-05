import { Box, Button } from "@mui/material";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";
import { useRoller } from "stores/appState/useRoller";

export enum ORACLE_KEYS {
  ALMOST_CERTAIN = "almostCertain",
  LIKELY = "likely",
  FIFTY_FIFTY = "fiftyFifty",
  UNLIKELY = "unlikely",
  SMALL_CHANCE = "smallChance",
}

const oracleOrder = [
  ORACLE_KEYS.SMALL_CHANCE,
  ORACLE_KEYS.UNLIKELY,
  ORACLE_KEYS.FIFTY_FIFTY,
  ORACLE_KEYS.LIKELY,
  ORACLE_KEYS.ALMOST_CERTAIN,
];

const askTheOracleOracles: GameSystemChooser<{ [key in ORACLE_KEYS]: string }> =
  {
    [GAME_SYSTEMS.IRONSWORN]: {
      [ORACLE_KEYS.ALMOST_CERTAIN]:
        "classic/oracles/moves/ask_the_oracle/almost_certain",
      [ORACLE_KEYS.LIKELY]: "classic/oracles/moves/ask_the_oracle/likely",
      [ORACLE_KEYS.FIFTY_FIFTY]:
        "classic/oracles/moves/ask_the_oracle/fifty_fifty",
      [ORACLE_KEYS.UNLIKELY]: "classic/oracles/moves/ask_the_oracle/unlikely",
      [ORACLE_KEYS.SMALL_CHANCE]:
        "classic/oracles/moves/ask_the_oracle/small_chance",
    },
    [GAME_SYSTEMS.STARFORGED]: {
      [ORACLE_KEYS.ALMOST_CERTAIN]:
        "starforged/oracles/moves/ask_the_oracle/almost_certain",
      [ORACLE_KEYS.LIKELY]: "starforged/oracles/moves/ask_the_oracle/likely",
      [ORACLE_KEYS.FIFTY_FIFTY]:
        "starforged/oracles/moves/ask_the_oracle/fifty_fifty",
      [ORACLE_KEYS.UNLIKELY]:
        "starforged/oracles/moves/ask_the_oracle/unlikely",
      [ORACLE_KEYS.SMALL_CHANCE]:
        "starforged/oracles/moves/ask_the_oracle/small_chance",
    },
  };

const askTheOracleLabels: { [key in ORACLE_KEYS]: string } = {
  [ORACLE_KEYS.ALMOST_CERTAIN]: "Almost Certain",
  [ORACLE_KEYS.LIKELY]: "Likely",
  [ORACLE_KEYS.FIFTY_FIFTY]: "50/50",
  [ORACLE_KEYS.UNLIKELY]: "Unlikely",
  [ORACLE_KEYS.SMALL_CHANCE]: "Small Chance",
};

export function AskTheOracleButtons() {
  const { rollOracleTableNew } = useRoller();
  const oracles = useGameSystemValue(askTheOracleOracles);

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      // border={(theme) => `1px solid ${theme.palette.divider}`}
    >
      {oracleOrder.map((oracleKey) => (
        <Button
          key={oracleKey}
          size={"small"}
          color={"inherit"}
          sx={(theme) => ({
            fontFamily: theme.fontFamilyTitle,
            lineHeight: 1,
            "&:hover": {
              bgcolor: theme.palette.darkGrey.main,
            },
            minHeight: 32,
            minWidth: 0,
            px: 1,
          })}
          onClick={() =>
            rollOracleTableNew(oracles[oracleKey as ORACLE_KEYS], true, true)
          }
        >
          {askTheOracleLabels[oracleKey as ORACLE_KEYS]}
        </Button>
      ))}
    </Box>
  );
}
