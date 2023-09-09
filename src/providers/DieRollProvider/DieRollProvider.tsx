import { Box, Fab, Slide } from "@mui/material";
import { PropsWithChildren, useState } from "react";
import { DieRollContext } from "./DieRollContext";
import {
  OracleTableRoll,
  Roll,
  ROLL_RESULT,
  ROLL_TYPE,
  StatRoll,
  TrackProgressRoll,
} from "types/DieRolls.type";
import { TransitionGroup } from "react-transition-group";
import ClearIcon from "@mui/icons-material/Close";
import { RollSnackbar } from "./RollSnackbar";
import { oracleCategoryMap, oracleMap } from "data/oracles";
import { useCustomOracles } from "components/OracleSection/useCustomOracles";
import { TRACK_TYPES } from "types/Track.type";
import { useStore } from "stores/store";

const getRoll = (dieMax: number) => {
  return Math.floor(Math.random() * dieMax) + 1;
};

export function DieRollProvider(props: PropsWithChildren) {
  const { children } = props;

  const uid = useStore((store) => store.auth.uid);
  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId ?? null
  );
  const campaignId = useStore(
    (store) => store.campaigns.currentCampaign.currentCampaignId
  );
  const addRollToLog = useStore((store) => store.gameLog.addRoll);

  const { allCustomOracleMap, customOracleCategories } = useCustomOracles();
  const combinedOracleCategories = {
    ...oracleCategoryMap,
  };
  customOracleCategories.forEach((category) => {
    combinedOracleCategories[category.$id] = category;
  });

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

  const rollStat = (
    label: string,
    modifier: number,
    adds?: number,
    showSnackbar = true
  ) => {
    const challenge1 = getRoll(10);
    const challenge2 = getRoll(10);
    const action = getRoll(6);

    const actionTotal = action + (modifier ?? 0) + (adds ?? 0);

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
      characterId,
      uid,
      gmsOnly: false,
    };

    if (adds) {
      statRoll.adds = adds;
    }

    addRollToLog({
      campaignId,
      characterId: characterId || undefined,
      roll: statRoll,
    }).catch(() => {});

    if (showSnackbar) {
      addRoll(statRoll);
    }

    return result;
  };

  const rollOracleTable = (
    oracleId: string,
    showSnackbar = true,
    gmsOnly = false
  ) => {
    const oracleCategoryId = oracleId.match(
      /ironsworn\/oracles\/[^\/]*/gm
    )?.[0];

    const oracle = oracleMap[oracleId] ?? allCustomOracleMap?.[oracleId];

    const oracleCategory = oracleCategoryId
      ? combinedOracleCategories[oracleCategoryId]
      : undefined;

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
      characterId,
      uid,
      gmsOnly,
    };

    if (showSnackbar) {
      addRollToLog({
        campaignId,
        characterId: characterId || undefined,
        roll: oracleRoll,
      }).catch(() => {});
      addRoll(oracleRoll);
    }

    return entry;
  };

  const rollTrackProgress = (
    trackType: TRACK_TYPES,
    trackLabel: string,
    trackProgress: number
  ) => {
    const challenge1 = getRoll(10);
    const challenge2 = getRoll(10);

    let result: ROLL_RESULT = ROLL_RESULT.WEAK_HIT;
    if (trackProgress > challenge1 && trackProgress > challenge2) {
      result = ROLL_RESULT.HIT;
      // Strong Hit
    } else if (trackProgress <= challenge1 && trackProgress <= challenge2) {
      result = ROLL_RESULT.MISS;
    }

    const trackProgressRoll: TrackProgressRoll = {
      type: ROLL_TYPE.TRACK_PROGRESS,
      rollLabel: trackLabel,
      timestamp: new Date(),
      challenge1,
      challenge2,
      trackProgress,
      trackType,
      result,
      characterId,
      uid,
      gmsOnly: false,
    };

    addRoll(trackProgressRoll);
    addRollToLog({
      campaignId,
      characterId: characterId || undefined,
      roll: trackProgressRoll,
    }).catch(() => {});

    return result;
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
      value={{ rolls, rollStat, rollOracleTable, rollTrackProgress }}
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
                  isExpanded={index === array.length - 1}
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
