import { Box, Fab, Slide } from "@mui/material";
import { PropsWithChildren, useState } from "react";
import {
  DieRollContext,
  OracleRoll,
  oracleRollChanceNames,
  OracleTableRoll,
  ORACLE_ROLL_CHANCE,
  Roll,
  ROLL_RESULT,
  ROLL_TYPE,
  StatRoll,
} from "./DieRollContext";
import { TransitionGroup } from "react-transition-group";
import ClearIcon from "@mui/icons-material/Close";
import { RollSnackbar } from "./RollSnackbar";
import { OracleTable } from "types/Oracles.type";

const getRoll = (dieMax: number) => {
  return Math.floor(Math.random() * dieMax) + 1;
};

const chanceCutoffs: { [key in ORACLE_ROLL_CHANCE]: number } = {
  [ORACLE_ROLL_CHANCE.ALMOST_CERTAIN]: 10,
  [ORACLE_ROLL_CHANCE.LIKELY]: 25,
  [ORACLE_ROLL_CHANCE.FIFTY_FIFTY]: 50,
  [ORACLE_ROLL_CHANCE.UNLIKELY]: 75,
  [ORACLE_ROLL_CHANCE.SMALL_CHANCE]: 90,
};

export function DieRollProvider(props: PropsWithChildren) {
  const { children } = props;

  const [rolls, setRolls] = useState<Roll[]>([]);
  const addRoll = (roll: Roll) => {
    setRolls((prevRolls) => {
      let newRolls = [...prevRolls];

      if (newRolls.length >= 3) {
        newRolls.shift();
      }

      newRolls.push(roll);

      return newRolls;
    });
  };

  const rollStat = (label: string, modifier?: number) => {
    const challenge1 = getRoll(10);
    const challenge2 = getRoll(10);
    const action = getRoll(6);

    const actionTotal = action + (modifier ?? 0);

    let result: ROLL_RESULT = ROLL_RESULT.WEAK_HIT;
    if (actionTotal > challenge1 && actionTotal > challenge2) {
      result = ROLL_RESULT.HIT;
      // Strong Hit
    } else if (actionTotal <= challenge1 && actionTotal <= challenge2) {
      result = ROLL_RESULT.MISS;
    }
    const statRoll: StatRoll = {
      type: ROLL_TYPE.STAT,
      action,
      modifier,
      challenge1,
      challenge2,
      result,
      rollLabel: label,
      timestamp: new Date(),
    };

    addRoll(statRoll);

    return result;
  };

  const rollOracle = (chance: ORACLE_ROLL_CHANCE) => {
    const roll = getRoll(100);
    const isSuccessful = roll > chanceCutoffs[chance];

    const oracleRoll: OracleRoll = {
      type: ROLL_TYPE.ORACLE,
      rollLabel: oracleRollChanceNames[chance],
      roll,
      result: isSuccessful ? "Yes" : "No",
      chance,
      timestamp: new Date(),
    };

    addRoll(oracleRoll);

    return isSuccessful;
  };

  const rollOracleTable = (
    oracleName: string | undefined,
    sectionName: string,
    oracleTable: OracleTable
  ) => {
    const roll = getRoll(100);
    const entry =
      oracleTable.find((entry) => roll <= entry.chance)?.description ??
      "Failed to get oracle entry.";

    const oracleRoll: OracleTableRoll = {
      type: ROLL_TYPE.ORACLE_TABLE,
      roll,
      result: entry,
      rollLabel: sectionName,
      oracleName,
      timestamp: new Date(),
    };

    addRoll(oracleRoll);

    return entry;
  };

  const clearRolls = () => {
    setRolls([]);
  };

  const clearRoll = (index: number) => {
    setRolls((prevRolls) => {
      let newRolls = [...prevRolls];

      newRolls.splice(index, 1);

      return newRolls;
    });
  };

  return (
    <DieRollContext.Provider
      value={{ rolls, rollStat, rollOracle, rollOracleTable }}
    >
      {children}
      <Box
        position={"fixed"}
        zIndex={10000}
        bottom={(theme) => theme.spacing(2)}
        right={(theme) => theme.spacing(2)}
        ml={2}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"flex-end"}
        sx={{
          "&>div": {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "flex-end",
          },
        }}
      >
        <TransitionGroup>
          {rolls.map((roll, index, array) => (
            <Slide
              direction={"left"}
              key={`${roll.rollLabel}.${roll.timestamp.getTime()}.${roll.type}`}
            >
              <span>
                <RollSnackbar
                  roll={roll}
                  clearRoll={() => clearRoll(index)}
                  isMostRecentRoll={index === array.length - 1}
                />
              </span>
            </Slide>
          ))}
        </TransitionGroup>
        <Slide direction={"left"} in={rolls.length > 0} unmountOnExit>
          <Fab
            variant={"extended"}
            size={"medium"}
            color={"secondary"}
            onClick={() => clearRolls()}
            sx={{ mt: 2 }}
          >
            Clear All
            <ClearIcon sx={{ ml: 1 }} />
          </Fab>
        </Slide>
      </Box>
    </DieRollContext.Provider>
  );
}
