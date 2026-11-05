import { useStore } from "stores/store";
import { useCallback } from "react";
import {
  ClockProgressionRoll,
  CustomDiceRoll,
  ROLL_RESULT,
  ROLL_TYPE,
  StatRoll,
  TrackProgressRoll,
} from "types/DieRolls.type";
import { parseDiceExpression } from "./rollers/diceExpressionParser";
import {
  getClockProgressionRollAnnouncement,
  getCustomDiceRollAnnouncement,
  getOracleRollAnnouncement,
  getStatRollAnnouncement,
  getTrackProgressRollAnnouncement,
} from "functions/rollText";
import { TrackTypes } from "types/Track.type";
import { LEGACY_TrackTypes } from "types/LegacyTrack.type";
import { rollOracle } from "./rollers/rollOracle";
import { idMap } from "data/idMap";
import { Datasworn, IdParser } from "@datasworn-community/core";
import { rollDice } from "./rollers/rollDice";
import { useHide3dDice } from "hooks/useHide3dDice";
import { Theme, useTheme } from "@mui/material";

const SUPPORTED_3D_DIE_SIDES = new Set([4, 6, 8, 10, 12, 20, 100]);

export interface RollResult {
  value: number
}

export const getRolls = async (challengeDice: number, actionDice: number, theme: Theme, hide3dDice: boolean): Promise<RollResult[]> => {
  const values = await rollDice(
    [
      { qty: challengeDice, sides: 10, themeColor: theme.palette.darkGrey.light },
      { qty: actionDice, sides: 6, themeColor: theme.palette.primary.main },
    ],
    !hide3dDice
  );
  return values.map((value) => ({ value }));
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

  const hide3dDice = useHide3dDice();

  const theme = useTheme();

  const rollStat = useCallback(
    async (
      label: string,
      modifier: number,
      move?: { name: string; id: string },
      adds?: number,
      showSnackbar = true
    ) => {
      const results = await getRolls(2, 1, theme, hide3dDice);
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
        announce(getStatRollAnnouncement(statRoll, !!verboseScreenReaderRolls));
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

      const oracleRoll = await rollOracle(oracle, characterId, uid, gmsOnly, theme, !showSnackbar || hide3dDice);
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
          getOracleRollAnnouncement(
            definedOracleRoll,
            !!verboseScreenReaderRolls,
            !!oracle.match &&
              !Array.isArray(definedOracleRoll.roll) &&
              checkIfMatch(definedOracleRoll.roll)
          )
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
      const results = await getRolls(2, 0, theme, hide3dDice);
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

      announce(getTrackProgressRollAnnouncement(trackProgressRoll));

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

      const result = await rollOracle(oracle, null, uid, true, theme, hide3dDice);

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
      announce(
        getClockProgressionRollAnnouncement(
          clockRoll,
          !!verboseScreenReaderRolls
        )
      );

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

  const rollCustomDice = useCallback(
    async (notation: string) => {
      const parsed = parseDiceExpression(notation);
      if (!parsed) return;

      const { diceCount, typeOfDice, modifier } = parsed;
      const use3D = !hide3dDice && SUPPORTED_3D_DIE_SIDES.has(typeOfDice);

      const dieValues = await rollDice(
        [
          {
            qty: diceCount,
            sides: typeOfDice,
            themeColor: theme.palette.primary.main,
          },
        ],
        use3D
      );

      const total = dieValues.reduce((sum, v) => sum + v, 0) + modifier;

      const customRoll: CustomDiceRoll = {
        type: ROLL_TYPE.CUSTOM_DICE,
        notation,
        dieSides: typeOfDice,
        dieValues,
        modifier,
        total,
        rollLabel: notation,
        timestamp: new Date(),
        characterId,
        uid,
        gmsOnly: false,
      };

      addRollToLog({
        campaignId,
        characterId: characterId || undefined,
        roll: customRoll,
      })
        .then((rollId) => {
          addRollToScreen(rollId, customRoll);
        })
        .catch(() => {});

      announce(getCustomDiceRollAnnouncement(customRoll));

      return total;
    },
    [
      addRollToLog,
      addRollToScreen,
      announce,
      campaignId,
      characterId,
      uid,
      hide3dDice,
      theme,
    ]
  );

  return {
    rollStat,
    rollClockProgression,
    rollTrackProgress,
    rollOracleTable,
    rollCustomDice,
  };
}

// A bit hacky, check if the last two digits of the number are equal to each other.
function checkIfMatch(num: number) {
  return num % 10 === Math.floor(num / 10) % 10;
}
