import {
  Box,
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Tooltip,
} from "@mui/material";
import { useGameSystemValue } from "hooks/useGameSystemValue";
import { ReactNode, useRef, useState } from "react";
import { GAME_SYSTEMS, GameSystemChooser } from "types/GameSystems.type";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useRoller } from "providers/DieRollProvider";
import SmallChanceIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import UnlikelyIcon from "@mui/icons-material/KeyboardArrowDown";
import FiftyFiftyIcon from "@mui/icons-material/HorizontalRule";
import LikelyIcon from "@mui/icons-material/KeyboardArrowUp";
import AlmostCertainIcon from "@mui/icons-material/KeyboardDoubleArrowUp";

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
        "ironsworn/oracles/moves/ask_the_oracle/almost_certain",
      [ORACLE_KEYS.LIKELY]: "ironsworn/oracles/moves/ask_the_oracle/likely",
      [ORACLE_KEYS.FIFTY_FIFTY]: "ironsworn/oracles/moves/ask_the_oracle/50_50",
      [ORACLE_KEYS.UNLIKELY]: "ironsworn/oracles/moves/ask_the_oracle/unlikely",
      [ORACLE_KEYS.SMALL_CHANCE]:
        "ironsworn/oracles/moves/ask_the_oracle/small_chance",
    },
    [GAME_SYSTEMS.STARFORGED]: {
      [ORACLE_KEYS.ALMOST_CERTAIN]:
        "starforged/oracles/moves/ask_the_oracle/almost_certain",
      [ORACLE_KEYS.LIKELY]: "starforged/oracles/moves/ask_the_oracle/likely",
      [ORACLE_KEYS.FIFTY_FIFTY]:
        "starforged/oracles/moves/ask_the_oracle/fifty-fifty",
      [ORACLE_KEYS.UNLIKELY]:
        "starforged/oracles/moves/ask_the_oracle/unlikely",
      [ORACLE_KEYS.SMALL_CHANCE]:
        "starforged/oracles/moves/ask_the_oracle/small_chance",
    },
  };

const askTheOracleLabels: { [key in ORACLE_KEYS]: string } = {
  [ORACLE_KEYS.ALMOST_CERTAIN]: "Almost Certain",
  [ORACLE_KEYS.LIKELY]: "Likely",
  [ORACLE_KEYS.FIFTY_FIFTY]: "Fifty-Fifty",
  [ORACLE_KEYS.UNLIKELY]: "Unlikely",
  [ORACLE_KEYS.SMALL_CHANCE]: "Small Chance",
};

const askTheOracleIcons: { [key in ORACLE_KEYS]: ReactNode } = {
  [ORACLE_KEYS.ALMOST_CERTAIN]: <AlmostCertainIcon />,
  [ORACLE_KEYS.LIKELY]: <LikelyIcon />,
  [ORACLE_KEYS.FIFTY_FIFTY]: <FiftyFiftyIcon />,
  [ORACLE_KEYS.UNLIKELY]: <UnlikelyIcon />,
  [ORACLE_KEYS.SMALL_CHANCE]: <SmallChanceIcon />,
};

export function AskTheOracleIconButtons() {
  const { rollOracleTable } = useRoller();
  const oracles = useGameSystemValue(askTheOracleOracles);

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      // border={(theme) => `1px solid ${theme.palette.divider}`}
    >
      {oracleOrder.map((oracleKey) => (
        <span key={oracleKey}>
          <Tooltip title={askTheOracleLabels[oracleKey as ORACLE_KEYS]}>
            <IconButton
              onClick={() =>
                rollOracleTable(oracles[oracleKey as ORACLE_KEYS], true, true)
              }
            >
              {askTheOracleIcons[oracleKey as ORACLE_KEYS]}
            </IconButton>
          </Tooltip>
        </span>
      ))}
    </Box>
  );
}
