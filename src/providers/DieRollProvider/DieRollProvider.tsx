import { Box, Fab, Slide } from "@mui/material";
import { PropsWithChildren, useState } from "react";
import {
  DieRollContext,
  OracleTableRoll,
  Roll,
  ROLL_RESULT,
  ROLL_TYPE,
  StatRoll,
} from "./DieRollContext";
import { TransitionGroup } from "react-transition-group";
import ClearIcon from "@mui/icons-material/Close";
import { RollSnackbar } from "./RollSnackbar";
import { oracleCategoryMap, oracleMap } from "data/oracles";
import { useCustomOracles } from "components/OracleSection/useCustomOracles";
import { CustomOracleSection } from "components/CustomOraclesSection";

const getRoll = (dieMax: number) => {
  return Math.floor(Math.random() * dieMax) + 1;
};

export function DieRollProvider(props: PropsWithChildren) {
  const { children } = props;
  const customOraclesSection = useCustomOracles();
  const combinedOracleCategories = {
    ...oracleCategoryMap,
  };
  if (customOraclesSection) {
    combinedOracleCategories[customOraclesSection.$id] = customOraclesSection;
  }

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

  const rollStat = (label: string, modifier: number, showSnackbar = true) => {
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

    if (showSnackbar) {
      addRoll(statRoll);
    }

    return result;
  };

  const rollOracleTable = (oracleId: string, showSnackbar = true) => {
    const oracleCategoryId = oracleId.match(
      /ironsworn\/oracles\/[^\/]*/gm
    )?.[0];

    const oracle =
      oracleMap[oracleId] ?? customOraclesSection?.Tables?.[oracleId];
    console.debug("Oracle:", oracle);
    console.debug("Combined Categories:", combinedOracleCategories);
    const oracleCategory = oracleCategoryId
      ? combinedOracleCategories[oracleCategoryId]
      : undefined;

    console.debug("Category:", oracleCategory);
    if (!oracle || !oracleCategory) return undefined;

    const roll = getRoll(100);
    const entry =
      oracle.Table.find(
        (entry) => (entry.Floor ?? 0) <= roll && roll <= (entry.Ceiling ?? 100)
      )?.Result ?? "Failed to get oracle entry.";

    const oracleRoll: OracleTableRoll = {
      type: ROLL_TYPE.ORACLE_TABLE,
      roll,
      result: entry,
      oracleCategoryName: oracleCategory.Title.Short,
      rollLabel: oracle.Title.Short,
      timestamp: new Date(),
    };

    if (showSnackbar) {
      addRoll(oracleRoll);
    }

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
    <DieRollContext.Provider value={{ rolls, rollStat, rollOracleTable }}>
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
