import { useStore } from "stores/store";
import { useCallback } from "react";
import {
  ClockProgressionRoll,
  ROLL_RESULT,
  ROLL_TYPE,
  StatRoll,
  TrackProgressRoll,
} from "types/DieRolls.type";
import { getRollResultLabel } from "components/features/charactersAndCampaigns/RollDisplay";
import { TrackTypes } from "types/Track.type";
import { LEGACY_TrackTypes } from "types/LegacyTrack.type";
import { rollOracle } from "./rollers/rollOracle";
import { idMap } from "data/idMap";
import { Datasworn, IdParser } from "@datasworn/core";
import { Dice } from "components/shared/Dice";
import { Theme, useTheme } from "@mui/material";

export interface RollResult {
  value: number
}

export const getRolls = async (challengeDice: number, actionDice: number, theme: Theme, hide3dDice: boolean): Promise<RollResult[]> => {
  if (hide3dDice) {
    const rolls: RollResult[] = [];
    for(let challenges = 0; challenges < challengeDice; challenges++) {
      rolls.push({
        value: Math.floor(Math.random() * 10) + 1
      });
    }
    for(let actions = 0; actions < actionDice; actions++) {
      rolls.push({
        value: Math.floor(Math.random() * 6) + 1
      });
    }
    return rolls;
  }

  Dice.clear().show();
  setTimeout(() => Dice.hide("fade-out"), 100);

  return await Dice.roll([
    { qty: challengeDice, sides: 10, themeColor: theme.palette.darkGrey.light },
    { qty: actionDice, sides: 6, themeColor: theme.palette.primary.main }
  ]);
};

export function useRoller() {
  const announce = useStore((store) => store.appState.announce);
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
  const addRollToScreen = useStore((store) => store.appState.addRoll);
  const addRollToLog = useStore((store) => store.gameLog.addRoll);

  const momentum = useStore(
    (store) => store.characters.currentCharacter.currentCharacter?.momentum ?? 0
  );

  const hide3dDice = useStore(
    (store) => store.auth.userDoc?.hide3dDice
  );

  const theme = useTheme();

  const rollStat = useCallback(
    async (
      label: string,
      modifier: number,
      move?: { name: string; id: string },
      adds?: number,
      showSnackbar = true
    ) => {
      const results = await getRolls(2, 1, theme, hide3dDice === true);
      const challenge1 = results[0].value;
      const challenge2 = results[1].value;
      const action = results[2].value;

      let matchedNegativeMomentum = false;
      if (momentum < 0 && Math.abs(momentum) === action) {
        matchedNegativeMomentum = true;
      }

      const actionTotal = Math.min(
        10,
        (matchedNegativeMomentum ? 0 : action) + (modifier ?? 0) + (adds ?? 0)
      );

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
        matchedNegativeMomentum,
      };

      if (adds) {
        statRoll.adds = adds;
      }
      if (move) {
        statRoll.moveName = move.name;
        statRoll.moveId = move.id;
      }

      addRollToLog({
        campaignId,
        characterId: characterId || undefined,
        roll: statRoll,
      })
        .then((rollId) => {
          addRollToScreen(rollId, statRoll);
        })
        .catch(() => {});

      if (showSnackbar) {
        let announcement = `Rolled ${
          move ? move.name + " using stat " + label : label
        }.`;
        if (matchedNegativeMomentum) {
          announcement += ` On your action die you rolled a ${
            action === 10 ? "max of 10" : action
          }, which matched your momentum of ${momentum}, so your action die got cancelled out. Your modifiers are ${modifier}${
            adds ? " plus " + adds + " adds" : ""
          } for a total of ${actionTotal}.`;
        } else {
          announcement += ` On your action die you rolled a ${
            action === 10 ? "max of 10" : action
          } plus ${modifier}${
            adds ? " plus " + adds + " adds" : ""
          } for a total of ${actionTotal}.`;
        }

        announcement += ` On your challenge die you rolled a ${challenge1} and a ${challenge2}, for a ${getRollResultLabel(
          result
        )}`;
        announce(
          verboseScreenReaderRolls
            ? announcement
            : `Rolled ${
                move ? move.name + "using stat" + label : label
              }. Your action die had a total of ${actionTotal} against ${challenge1} and ${challenge2}, for a ${getRollResultLabel(
                result
              )}`
        );
      }

      return result;
    },
    [
      addRollToLog,
      addRollToScreen,
      announce,
      campaignId,
      characterId,
      uid,
      verboseScreenReaderRolls,
      momentum,
      theme,
      hide3dDice
    ]
  );

  const rollOracleTable = useCallback(
    async (potentialOldOracleId: string, showSnackbar = true, gmsOnly = false) => {
      const oracleId = idMap[potentialOldOracleId] ?? potentialOldOracleId;
      // const oracle = newOracles[oracleId];

      let oracle: Datasworn.OracleRollable | undefined;
      try {
        oracle = IdParser.get(oracleId) as Datasworn.OracleRollable;
      } catch {
        // Empty on purpose - the following if statement will handle the undefined case
      }

      if (!oracle || oracle.type !== "oracle_rollable") {
        return undefined;
      }

      const oracleRoll = await rollOracle(oracle, characterId, uid, gmsOnly, theme, !showSnackbar || hide3dDice === true);
      if (!oracleRoll) return undefined;

      let result = oracleRoll.result ?? "";

      const isOracleResultRegex = new RegExp(/\[[^\]]*\]([^)]*)\)/gm);
      if (result.match(isOracleResultRegex)) {
        const secondHalfRegex = new RegExp(/\]\(([^)]*)\)/gm);
        result = result.replaceAll("[", "").replaceAll(secondHalfRegex, "");
      }

      const definedOracleRoll = {
        ...oracleRoll,
        result,
      };

      if (showSnackbar && definedOracleRoll) {
        if (characterId || campaignId) {
          addRollToLog({
            campaignId,
            characterId: characterId || undefined,
            roll: definedOracleRoll,
          })
            .then((rollId) => {
              addRollToScreen(rollId, definedOracleRoll);
            })
            .catch(() => {});
        } else {
          addRollToScreen(
            definedOracleRoll.timestamp.toISOString(),
            definedOracleRoll
          );
        }
        announce(
          `Rolled ${
            verboseScreenReaderRolls
              ? `a ${definedOracleRoll.roll} on the ${definedOracleRoll.rollLabel} table`
              : definedOracleRoll.rollLabel
          } and got result ${definedOracleRoll.result}`
        );
      }

      return definedOracleRoll;
    },
    [
      characterId,
      uid,
      announce,
      addRollToLog,
      addRollToScreen,
      campaignId,
      verboseScreenReaderRolls,
      theme,
      hide3dDice
    ]
  );

  const rollTrackProgress = useCallback(
    async (
      trackLabel: string,
      trackProgress: number,
      moveId: string,
      trackType?: TrackTypes | LEGACY_TrackTypes,
    ) => {
      const results = await getRolls(2, 0, theme, hide3dDice === true);
      const challenge1 = results[0].value;
      const challenge2 = results[1].value;

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
        trackType: trackType ?? "",
        result,
        characterId,
        uid,
        gmsOnly: false,
        moveId,
      };

      addRollToLog({
        campaignId,
        characterId: characterId || undefined,
        roll: trackProgressRoll,
      })
        .then((rollId) => {
          addRollToScreen(rollId, trackProgressRoll);
        })
        .catch(() => {});

      const rollString = trackProgressRoll.trackType
        ? `${trackProgressRoll.trackType} ${trackProgressRoll.rollLabel}`
        : trackProgressRoll.rollLabel;

      announce(
        `Rolled progress for ${rollString}. Your progress was ${trackProgressRoll.trackProgress} against a ${
          trackProgressRoll.challenge1
        } and a ${trackProgressRoll.challenge2} for a ${getRollResultLabel(
          trackProgressRoll.result
        )}`
      );

      return result;
    },
    [
      announce,
      addRollToLog,
      addRollToScreen,
      campaignId,
      characterId,
      uid,
      theme,
      hide3dDice
    ]
  );

  const rollClockProgression = useCallback(
    async (clockTitle: string, oracleId: string) => {
      let oracle: Datasworn.OracleRollable | undefined = undefined;
      try {
        oracle = IdParser.get(oracleId) as Datasworn.OracleRollable;
      } catch {
        // Empty on purpose - the following if statement will handle the undefined case
      }

      if (!oracle || oracle.type !== "oracle_rollable") return undefined;

      const result = await rollOracle(oracle, null, uid, true, theme, hide3dDice === true);

      if (!result) return undefined;

      const resultRoll = Array.isArray(result.roll)
        ? result.roll[0]
        : result.roll;

      const clockRoll: ClockProgressionRoll = {
        type: ROLL_TYPE.CLOCK_PROGRESSION,
        roll: resultRoll,
        result: result.result,
        oracleTitle: result.rollLabel,
        oracleId: oracleId,
        rollLabel: clockTitle,
        timestamp: new Date(),
        match: checkIfMatch(resultRoll),
        characterId,
        uid,
        gmsOnly: false,
      };

      addRollToLog({
        campaignId,
        characterId: characterId || undefined,
        roll: clockRoll,
      })
        .then((rollId) => {
          addRollToScreen(rollId, clockRoll);
        })
        .catch(() => {});
      if (verboseScreenReaderRolls) {
        announce(
          `Rolled for clock ${clockRoll.rollLabel} with a ${
            clockRoll.roll
          } against oracle ${clockRoll.oracleTitle}. Your clock ${
            result.result === "Yes"
              ? "progressed by one segment."
              : "did not progress"
          }`
        );
      } else {
        announce(
          `Your clock ${clockRoll.rollLabel} ${
            result.result === "Yes"
              ? "progressed by one segment."
              : "did not progress"
          }`
        );
      }

      return clockRoll;
    },
    [
      announce,
      verboseScreenReaderRolls,
      characterId,
      campaignId,
      uid,
      addRollToLog,
      addRollToScreen,
      theme,
      hide3dDice
    ]
  );

  return {
    rollStat,
    rollClockProgression,
    rollTrackProgress,
    rollOracleTable,
  };
}

// A bit hacky, check if the last two digits of the number are equal to each other.
function checkIfMatch(num: number) {
  return num % 10 === Math.floor(num / 10) % 10;
}
