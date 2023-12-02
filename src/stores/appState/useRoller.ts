import { useCustomOracles } from "components/features/charactersAndCampaigns/OracleSection/useCustomOracles";
import { useStore } from "stores/store";
import { oracleCategoryMap, oracleMap } from "data/oracles";
import { useCallback, useMemo } from "react";
import {
  ClockProgressionRoll,
  OracleTableRoll,
  ROLL_RESULT,
  ROLL_TYPE,
  StatRoll,
  TrackProgressRoll,
} from "types/DieRolls.type";
import { getRollResultLabel } from "components/features/charactersAndCampaigns/RollDisplay";
import { TRACK_TYPES } from "types/Track.type";
import { LEGACY_TRACK_TYPES } from "types/LegacyTrack.type";

export const getRoll = (dieMax: number) => {
  return Math.floor(Math.random() * dieMax) + 1;
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

  const { allCustomOracleMap, customOracleCategories } = useCustomOracles();
  const combinedOracleCategories = useMemo(() => {
    const categories = {
      ...oracleCategoryMap,
    };
    customOracleCategories.forEach((category) => {
      categories[category.$id] = category;
    });
    return categories;
  }, [customOracleCategories]);

  const rollStat = useCallback(
    (
      label: string,
      modifier: number,
      moveName?: string,
      adds?: number,
      showSnackbar = true
    ) => {
      const challenge1 = getRoll(10);
      const challenge2 = getRoll(10);
      const action = getRoll(6);

      const actionTotal = Math.min(10, action + (modifier ?? 0) + (adds ?? 0));

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
      })
        .then((rollId) => {
          addRollToScreen(rollId, statRoll);
        })
        .catch(() => {});

      if (showSnackbar) {
        announce(
          verboseScreenReaderRolls
            ? `Rolled ${
                moveName ? moveName + " using stat " + label : label
              }. On your action die you rolled a ${
                action === 10 ? "max of 10" : action
              } plus ${modifier}${
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
    ]
  );

  const rollOracleTable = useCallback(
    (oracleId: string, showSnackbar = true, gmsOnly = false) => {
      const oracleCategoryId = oracleId.match(
        /(ironsworn|starforged)\/oracles\/[^/]*/gm
      )?.[0];

      const oracle = oracleMap[oracleId] ?? allCustomOracleMap?.[oracleId];

      const oracleCategory = oracleCategoryId
        ? combinedOracleCategories[oracleCategoryId]
        : undefined;

      if (!oracle || !oracleCategory) return undefined;

      const roll = getRoll(100);

      let entry =
        oracle.Table.find(
          (entry) =>
            entry.Floor !== null &&
            entry.Ceiling !== null &&
            entry.Floor <= roll &&
            roll <= entry.Ceiling
        )?.Result ?? "Failed to get oracle entry.";

      const isOracleResultRegex = new RegExp(/\[⏵[^\]]*\]([^)]*)\)/gm);
      if (entry.match(isOracleResultRegex)) {
        const secondHalfRegex = new RegExp(/\]([^)]*)\)/gm);
        entry = entry.replaceAll("[⏵", "").replaceAll(secondHalfRegex, "");
      }

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
        })
          .then((rollId) => {
            addRollToScreen(rollId, oracleRoll);
          })
          .catch(() => {});
        announce(
          `Rolled ${
            verboseScreenReaderRolls
              ? `a ${oracleRoll.roll} on the ${oracleRoll.rollLabel} table`
              : oracleRoll.rollLabel
          } and got result ${oracleRoll.result}`
        );
      }

      return entry;
    },
    [
      addRollToLog,
      addRollToScreen,
      announce,
      characterId,
      campaignId,
      uid,
      allCustomOracleMap,
      combinedOracleCategories,
      verboseScreenReaderRolls,
    ]
  );

  const rollTrackProgress = useCallback(
    (
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

      addRollToLog({
        campaignId,
        characterId: characterId || undefined,
        roll: trackProgressRoll,
      })
        .then((rollId) => {
          addRollToScreen(rollId, trackProgressRoll);
        })
        .catch(() => {});
      announce(
        `Rolled progress for ${trackProgressRoll.trackType} ${
          trackProgressRoll.rollLabel
        }. Your progress was ${trackProgressRoll.trackProgress} against a ${
          trackProgressRoll.challenge1
        } and a ${trackProgressRoll.challenge2} for a ${getRollResultLabel(
          trackProgressRoll.result
        )}`
      );

      return result;
    },
    [announce, addRollToLog, addRollToScreen, campaignId, characterId, uid]
  );

  const rollClockProgression = useCallback(
    (clockTitle: string, oracleId: string) => {
      const oracleCategoryId = oracleId.match(
        /(ironsworn|starforged)\/oracles\/[^/]*/gm
      )?.[0];

      const oracle = oracleMap[oracleId] ?? allCustomOracleMap?.[oracleId];

      const oracleCategory = oracleCategoryId
        ? combinedOracleCategories[oracleCategoryId]
        : undefined;

      if (!oracle || !oracleCategory) return false;

      const roll = getRoll(100);
      const entry =
        oracle.Table.find(
          (entry) =>
            (entry.Floor ?? 0) <= roll && roll <= (entry.Ceiling ?? 100)
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
            entry === "Yes" ? "progressed by one segment." : "did not progress"
          }`
        );
      } else {
        announce(
          `Your clock ${clockRoll.rollLabel} ${
            entry === "Yes" ? "progressed by one segment." : "did not progress"
          }`
        );
      }

      return entry === "Yes";
    },
    [
      announce,
      verboseScreenReaderRolls,
      characterId,
      campaignId,
      uid,
      addRollToLog,
      addRollToScreen,
      allCustomOracleMap,
      combinedOracleCategories,
    ]
  );

  return { rollStat, rollOracleTable, rollClockProgression, rollTrackProgress };
}
