import { Box, Fab, Slide } from "@mui/material";
import { PropsWithChildren, useState } from "react";
import { DieRollContext } from "./DieRollContext";
import {
  ClockProgressionRoll,
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
import { useCustomOracles } from "components/features/charactersAndCampaigns/OracleSection/useCustomOracles";
import { TRACK_TYPES } from "types/Track.type";
import { useStore } from "stores/store";
import { LEGACY_TRACK_TYPES } from "types/LegacyTrack.type";
import { useScreenReaderAnnouncement } from "providers/ScreenReaderAnnouncementProvider";
import { getRollResultLabel } from "./RollSnackbar/StatRollSnackbar";

const getRoll = (dieMax: number) => {
  return Math.floor(Math.random() * dieMax) + 1;
};

export function DieRollProvider(props: PropsWithChildren) {
  const { children } = props;
  const { setAnnouncement } = useScreenReaderAnnouncement();
  const verboseScreenReaderRolls = useStore(
    (store) => store.accessibilitySettings.settings.verboseRollResults
  );

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
    moveName?: string,
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
    if (moveName) {
      statRoll.moveName = moveName;
    }

    addRollToLog({
      campaignId,
      characterId: characterId || undefined,
      roll: statRoll,
    }).catch(() => {});

    if (showSnackbar) {
      setAnnouncement(
        verboseScreenReaderRolls
          ? `Rolled ${
              moveName ? moveName + " using stat " + label : label
            }. On your action die you rolled a ${action} plus ${modifier}${
              adds ? " plus " + adds + " adds" : ""
            } for a total of ${actionTotal}. On your challenge die you rolled a ${challenge1} and a ${challenge2}, for a ${getRollResultLabel(
              result
            )}`
          : `Rolled ${
              moveName ? moveName + "using stat" + label : label
            }. Your action die had a total of ${actionTotal} against ${challenge1} and ${challenge2}, for a ${getRollResultLabel(
              result
            )}`
      );
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
      /(ironsworn|starforged)\/oracles\/[^\/]*/gm
    )?.[0];

    const oracle = oracleMap[oracleId] ?? allCustomOracleMap?.[oracleId];

    const oracleCategory = oracleCategoryId
      ? combinedOracleCategories[oracleCategoryId]
      : undefined;

    if (!oracle || !oracleCategory) return undefined;

    const roll = getRoll(100);
    const entry =
      oracle.Table.find(
        (entry) =>
          entry.Floor !== null &&
          entry.Ceiling !== null &&
          entry.Floor <= roll &&
          roll <= entry.Ceiling
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
      setAnnouncement(
        `Rolled ${
          verboseScreenReaderRolls
            ? `a ${oracleRoll.roll} on the ${oracleRoll.rollLabel} table`
            : oracleRoll.rollLabel
        } and got result ${oracleRoll.result}`
      );
    }

    return entry;
  };

  const rollTrackProgress = (
    trackType: TRACK_TYPES | LEGACY_TRACK_TYPES,
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
    setAnnouncement(
      `Rolled progress for ${trackProgressRoll.trackType} ${
        trackProgressRoll.rollLabel
      }. Your progress was ${trackProgressRoll.trackProgress} against a ${
        trackProgressRoll.challenge1
      } and a ${trackProgressRoll.challenge2} for a ${getRollResultLabel(
        trackProgressRoll.result
      )}`
    );

    return result;
  };

  const rollClockProgression = (clockTitle: string, oracleId: string) => {
    const oracleCategoryId = oracleId.match(
      /(ironsworn|starforged)\/oracles\/[^\/]*/gm
    )?.[0];

    const oracle = oracleMap[oracleId] ?? allCustomOracleMap?.[oracleId];

    const oracleCategory = oracleCategoryId
      ? combinedOracleCategories[oracleCategoryId]
      : undefined;

    if (!oracle || !oracleCategory) return false;

    const roll = getRoll(100);
    const entry =
      oracle.Table.find(
        (entry) => (entry.Floor ?? 0) <= roll && roll <= (entry.Ceiling ?? 100)
      )?.Result ?? "Failed to get oracle entry.";

    const clockRoll: ClockProgressionRoll = {
      type: ROLL_TYPE.CLOCK_PROGRESSION,
      roll,
      result: entry,
      oracleTitle: oracle.Title.Short,
      rollLabel: clockTitle,
      timestamp: new Date(),
      characterId,
      uid,
      gmsOnly: false,
    };

    addRollToLog({
      campaignId,
      characterId: characterId || undefined,
      roll: clockRoll,
    }).catch(() => {});
    addRoll(clockRoll);
    if (verboseScreenReaderRolls) {
      setAnnouncement(
        `Rolled for clock ${clockRoll.rollLabel} with a ${
          clockRoll.roll
        } against oracle ${clockRoll.oracleTitle}. Your clock ${
          entry === "Yes" ? "progressed by one segment." : "did not progress"
        }`
      );
    } else {
      setAnnouncement(
        `Your clock ${clockRoll.rollLabel} ${
          entry === "Yes" ? "progressed by one segment." : "did not progress"
        }`
      );
    }

    return entry === "Yes";
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
      value={{
        rolls,
        rollStat,
        rollOracleTable,
        rollTrackProgress,
        rollClockProgression,
      }}
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
            color={"primary"}
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
