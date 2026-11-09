// Text for screen readers that says what a roll did. Announcements are read
// out once, right after a roll; descriptions stand in for a roll card or a
// game log entry, whose dice, totals and icons are drawn for the eye.

import {
  ClockProgressionRoll,
  CustomDiceRoll,
  OracleTableRoll,
  ROLL_TYPE,
  Roll,
  StatRoll,
  TrackProgressRoll,
} from "types/DieRolls.type";
import { getRollResultLabel } from "components/features/charactersAndCampaigns/RollDisplay/getRollResultLabel";
import { getTrackTypeLabel } from "components/features/charactersAndCampaigns/RollDisplay/clipboardFormatter";

const MAX_ACTION_TOTAL = 10;

/** "a 7", but "an 8", "an 11" and "an 18". */
export function withArticle(value: number): string {
  const digits = String(Math.abs(value));
  const an = digits.startsWith("8") || digits === "11" || digits === "18";
  return `${an ? "an" : "a"} ${value}`;
}

/** " plus 2", " minus 1", or nothing for 0. */
function formatSigned(value: number | undefined): string {
  if (!value) return "";
  return value > 0 ? ` plus ${value}` : ` minus ${Math.abs(value)}`;
}

/** Ends the text with a full stop unless it already ends a sentence. */
function endSentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

/**
 * Oracle results are Markdown. This keeps the words and drops the marks, and
 * turns each line (such as "* Name: Bram") into a sentence, so a screen
 * reader neither spells out asterisks nor runs the lines together.
 */
export function markdownToPlainText(markdown: string): string {
  return markdown
    .split("\n")
    .map((line) =>
      line
        .replace(/^\s*#+\s*/, "")
        .replace(/^\s*(?:[*+-]|\d+\.)\s+/, "")
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/\*\*|__|~~|[*`]/g, "")
        .trim()
    )
    .filter((line) => line.length > 0)
    .map((line, index, lines) =>
      index < lines.length - 1 && !/[.!?:;,]$/.test(line) ? `${line}.` : line
    )
    .join(" ");
}

function getStatRollTitle(roll: StatRoll): string {
  return roll.moveName
    ? `${roll.moveName} using stat ${roll.rollLabel}`
    : roll.rollLabel;
}

function getStatTotals(roll: StatRoll) {
  const rawTotal =
    (roll.matchedNegativeMomentum ? 0 : roll.action) +
    (roll.modifier ?? 0) +
    (roll.adds ?? 0);
  const total = Math.min(MAX_ACTION_TOTAL, rawTotal);
  const totalText =
    rawTotal > MAX_ACTION_TOTAL ? `${total}, the maximum` : `${total}`;
  const modifiersText =
    formatSigned(roll.modifier) +
    (roll.adds ? ` plus ${roll.adds} ${roll.adds === 1 ? "add" : "adds"}` : "");
  return { total, totalText, modifiersText };
}

function getTrackRollTitle(roll: TrackProgressRoll): string {
  const typeLabel = roll.trackType ? getTrackTypeLabel(roll.trackType) : "";
  return typeLabel ? `${typeLabel} ${roll.rollLabel}` : roll.rollLabel;
}

function getOracleResultText(roll: OracleTableRoll): string {
  return [roll.result, roll.text2, roll.text3]
    .filter((text): text is string => !!text)
    .map((text) => endSentence(markdownToPlainText(text)))
    .join(" ");
}

function formatOracleRolls(rolls: number | number[]): string {
  return Array.isArray(rolls) ? rolls.join(", ") : `${rolls}`;
}

function isYes(result: string): boolean {
  return result.trim().toLocaleLowerCase() === "yes";
}

function getClockOutcome(roll: ClockProgressionRoll): string {
  if (!isYes(roll.result)) return "did not progress.";
  return roll.match
    ? "progressed by two segments."
    : "progressed by one segment.";
}

export function getStatRollAnnouncement(
  roll: StatRoll,
  verbose: boolean
): string {
  const { totalText, modifiersText } = getStatTotals(roll);
  const result = getRollResultLabel(roll.result);
  const match = roll.challenge1 === roll.challenge2 ? ", with a match" : "";
  const title = getStatRollTitle(roll);

  if (!verbose) {
    const cancelled = roll.matchedNegativeMomentum
      ? ", with your action die cancelled by momentum,"
      : "";
    return `Rolled ${title}. Your action total was ${totalText}${cancelled} against ${roll.challenge1} and ${roll.challenge2}, for a ${result}${match}.`;
  }

  const action = roll.matchedNegativeMomentum
    ? `On your action die you rolled ${withArticle(
        roll.action
      )}, which matched your momentum of ${-roll.action}, so your action die was cancelled. With your modifiers alone, your total is ${totalText}.`
    : `On your action die you rolled ${withArticle(
        roll.action
      )}${modifiersText}, for a total of ${totalText}.`;

  return `Rolled ${title}. ${action} On your challenge dice you rolled ${withArticle(
    roll.challenge1
  )} and ${withArticle(roll.challenge2)}, for a ${result}${match}.`;
}

export function getOracleRollAnnouncement(
  roll: OracleTableRoll,
  verbose: boolean,
  isMatch = false
): string {
  const rolled =
    verbose && !Array.isArray(roll.roll)
      ? `${withArticle(roll.roll)} on the ${roll.rollLabel} table`
      : verbose
        ? `${formatOracleRolls(roll.roll)} on the ${roll.rollLabel} table`
        : roll.rollLabel;
  const result = getOracleResultText(roll);
  return `Rolled ${rolled} and got: ${result}${isMatch ? " A match." : ""}`;
}

export function getTrackProgressRollAnnouncement(
  roll: TrackProgressRoll
): string {
  const doubles = roll.challenge1 === roll.challenge2 ? ", with doubles" : "";
  return `Rolled progress for ${getTrackRollTitle(roll)}. Your progress was ${
    roll.trackProgress
  } against ${withArticle(roll.challenge1)} and ${withArticle(
    roll.challenge2
  )}, for a ${getRollResultLabel(roll.result)}${doubles}.`;
}

export function getClockProgressionRollAnnouncement(
  roll: ClockProgressionRoll,
  verbose: boolean
): string {
  if (!verbose) {
    return `Your clock ${roll.rollLabel} ${getClockOutcome(roll)}`;
  }
  return `Rolled ${withArticle(roll.roll)} for clock ${
    roll.rollLabel
  } against oracle ${roll.oracleTitle}${
    roll.match ? ", a match" : ""
  }. Your clock ${getClockOutcome(roll)}`;
}

export function getCustomDiceRollAnnouncement(roll: CustomDiceRoll): string {
  return `Rolled ${roll.notation}. Got ${roll.dieValues.join(
    ", "
  )}${formatSigned(roll.modifier)}, for a total of ${roll.total}.`;
}

/** The roll's name as its card shows it, for naming the card's buttons. */
export function getRollTitle(roll: Roll): string {
  switch (roll.type) {
    case ROLL_TYPE.STAT:
      return roll.moveName ? roll.moveName : roll.rollLabel;
    case ROLL_TYPE.CUSTOM_DICE:
      return roll.notation;
    default:
      return roll.rollLabel;
  }
}

export interface RollDescriptionOptions {
  // Whether an oracle roll counts as a match. Only some oracles have matches,
  // which the roll itself does not record.
  oracleMatch?: boolean;
}

/**
 * Everything a roll card shows, as sentences: the roll's name, the dice, the
 * totals, the result and any match.
 */
export function getRollDescription(
  roll: Roll,
  options: RollDescriptionOptions = {}
): string {
  switch (roll.type) {
    case ROLL_TYPE.STAT: {
      const { totalText, modifiersText } = getStatTotals(roll);
      const title = roll.moveName
        ? `${roll.moveName}, using ${roll.rollLabel}`
        : roll.rollLabel;
      const cancelled = roll.matchedNegativeMomentum
        ? ", cancelled by negative momentum"
        : "";
      const burned = roll.momentumBurned
        ? ` Burned ${roll.momentumBurned} momentum in place of the action total.`
        : "";
      const extras = [
        roll.challenge1 === roll.challenge2 ? " Match." : "",
        roll.action === 1 ? " One on the action die." : "",
      ].join("");
      return `${endSentence(title)} Action die ${
        roll.action
      }${cancelled}${modifiersText}, total ${totalText}. Challenge dice ${
        roll.challenge1
      } and ${roll.challenge2}.${burned} ${getRollResultLabel(
        roll.result
      )}.${extras}`;
    }
    case ROLL_TYPE.TRACK_PROGRESS: {
      const doubles = roll.challenge1 === roll.challenge2 ? " Doubles." : "";
      return `${endSentence(getTrackRollTitle(roll))} Progress ${
        roll.trackProgress
      }. Challenge dice ${roll.challenge1} and ${
        roll.challenge2
      }. ${getRollResultLabel(roll.result)}.${doubles}`;
    }
    case ROLL_TYPE.ORACLE_TABLE: {
      const title = roll.oracleCategoryName
        ? `${roll.oracleCategoryName}, ${roll.rollLabel}`
        : roll.rollLabel;
      return `${endSentence(title)} Rolled ${formatOracleRolls(
        roll.roll
      )}. ${getOracleResultText(roll)}${options.oracleMatch ? " Match." : ""}`;
    }
    case ROLL_TYPE.CLOCK_PROGRESSION:
      return `Clock ${roll.rollLabel}, ${roll.oracleTitle}. Rolled ${
        roll.roll
      }. ${endSentence(markdownToPlainText(roll.result))}${
        roll.match ? " Match." : ""
      }`;
    case ROLL_TYPE.CUSTOM_DICE:
      return `${roll.notation}. Rolled ${roll.dieValues.join(
        ", "
      )}${formatSigned(roll.modifier)}. Total ${roll.total}.`;
  }
}
