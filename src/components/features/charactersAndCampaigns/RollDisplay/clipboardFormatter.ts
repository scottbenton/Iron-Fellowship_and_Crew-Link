import {
  ClockProgressionRoll,
  OracleTableRoll,
  ROLL_TYPE,
  Roll,
  StatRoll,
  TrackProgressRoll,
} from "types/DieRolls.type";
import { getRollResultLabel } from "./getRollResultLabel";
import { TRACK_TYPES } from "types/Track.type";
import { LEGACY_TRACK_TYPES } from "types/LegacyTrack.type";

export function formatQuote(contents: string) {
  return `<blockquote>${contents}</blockquote>`;
}

export function formatBold(contents: string) {
  return `<b>${contents}</b>`;
}

export function formatItalic(contents: string) {
  return `<em>${contents}</em>`;
}

export function formatParagraph(contents: string) {
  return `<p>${contents}</p>`;
}

export function convertRollToClipboard(roll: Roll):
  | {
      rich: string;
      plain: string;
    }
  | undefined {
  switch (roll.type) {
    case ROLL_TYPE.STAT:
      const statContents = extractStatRollContents(roll);
      return {
        rich: convertStatRollToClipboardRich(statContents),
        plain: convertStatRollToClipboardPlain(statContents),
      };
    case ROLL_TYPE.ORACLE_TABLE:
      const oracleContents = extractOracleRollContents(roll);
      return {
        rich: convertOracleRollToClipboardRich(oracleContents),
        plain: convertOracleRollToClipboardPlain(oracleContents),
      };
    case ROLL_TYPE.TRACK_PROGRESS:
      const trackProgressContents = extractTrackProgressRollContents(roll);
      return {
        rich: convertTrackProgressRollToClipboardRich(trackProgressContents),
        plain: convertTrackProgressRollToClipboardPlain(trackProgressContents),
      };
    case ROLL_TYPE.CLOCK_PROGRESSION:
      const clockProgressionContents =
        extractClockProgressionRollContents(roll);

      return {
        rich: convertClockProgressionRollToClipboardRich(
          clockProgressionContents
        ),
        plain: convertClockProgressionRollToClipboardPlain(
          clockProgressionContents
        ),
      };
    default:
      return undefined;
  }
}

interface StatRollContents {
  title: string;
  actionContents: string;
  challengeContents: string;
  result: string;
}

export function extractStatRollContents(roll: StatRoll): StatRollContents {
  const title = roll.moveName
    ? `${roll.moveName} (${roll.rollLabel})`
    : roll.rollLabel;
  let actionContents = roll.action + "";
  if (roll.modifier || roll.adds) {
    const rollTotal = roll.action + (roll.modifier ?? 0) + (roll.adds ?? 0);
    actionContents +=
      (roll.modifier ? ` + ${roll.modifier}` : "") +
      (roll.adds ? ` + ${roll.adds}` : "") +
      ` = ${rollTotal > 10 ? "10 (Max)" : rollTotal}`;
  }
  const challengeContents = `${roll.challenge1}, ${roll.challenge2}`;

  const result = getRollResultLabel(roll.result).toLocaleUpperCase();

  return {
    title,
    actionContents,
    challengeContents,
    result,
  };
}

export function convertStatRollToClipboardRich(
  contents: StatRollContents
): string {
  const title = formatParagraph(contents.title);
  const action = formatParagraph(
    formatItalic("Action: ") + contents.actionContents
  );
  const challenge = formatParagraph(
    formatItalic("Challenge: ") + contents.challengeContents
  );
  const result = formatBold(contents.result);

  return formatQuote(title + action + challenge + result);
}

export function convertStatRollToClipboardPlain(contents: StatRollContents) {
  return `
${contents.title}
Action: ${contents.actionContents}
Challenge: ${contents.challengeContents}
${contents.result}
    `;
}

interface OracleRollContents {
  title: string;
  roll: string;
  result: string;
}

export function extractOracleRollContents(
  roll: OracleTableRoll
): OracleRollContents {
  const title = roll.oracleCategoryName
    ? `${roll.oracleCategoryName} ꞏ ${roll.rollLabel}`
    : roll.rollLabel;
  const rollSection = roll.roll + "";
  const result = roll.result;

  return {
    title,
    roll: rollSection,
    result,
  };
}

export function convertOracleRollToClipboardRich(
  contents: OracleRollContents
): string {
  const title = formatParagraph(contents.title);
  const roll = formatParagraph(formatItalic("Roll: ") + contents.roll);
  const result = formatBold(contents.result);

  return formatQuote(title + roll + result);
}

export function convertOracleRollToClipboardPlain(
  contents: OracleRollContents
) {
  return `
${contents.title}
Roll: ${contents.roll}
${contents.result}
    `;
}

interface TrackProgressRollContents {
  title: string;
  progress: string;
  challenge: string;
  result: string;
}

function getTrackTypeLabel(type: TRACK_TYPES | LEGACY_TRACK_TYPES) {
  switch (type) {
    case TRACK_TYPES.VOW:
      return "Vow";
    case TRACK_TYPES.BOND_PROGRESS:
      return "Bond Progress";
    case TRACK_TYPES.CLOCK:
      return "Clock Progress";
    case TRACK_TYPES.FRAY:
      return "Fray";
    case TRACK_TYPES.JOURNEY:
      return "Journey";
    case LEGACY_TRACK_TYPES.BONDS:
      return "Bonds";
    case LEGACY_TRACK_TYPES.DISCOVERIES:
      return "Discoveries";
    case LEGACY_TRACK_TYPES.QUESTS:
      return "Quests";
    default:
      return "";
  }
}

export function extractTrackProgressRollContents(
  roll: TrackProgressRoll
): TrackProgressRollContents {
  const title = `${getTrackTypeLabel(roll.trackType)}: ${roll.rollLabel}`;
  const progress = roll.trackProgress + "";
  const challenge = `${roll.challenge1}, ${roll.challenge2}`;
  const result = getRollResultLabel(roll.result).toLocaleUpperCase();

  return {
    title,
    progress,
    challenge,
    result,
  };
}

export function convertTrackProgressRollToClipboardRich(
  contents: TrackProgressRollContents
): string {
  const title = formatParagraph(contents.title);
  const progress = formatParagraph(
    formatItalic("Progress: ") + contents.progress
  );
  const challenge = formatParagraph(
    formatItalic("Challenge: ") + contents.challenge
  );
  const result = formatBold(contents.result);

  return formatQuote(title + progress + challenge + result);
}

export function convertTrackProgressRollToClipboardPlain(
  contents: TrackProgressRollContents
) {
  return `
${contents.title}
Progress: ${contents.progress}
Challenge: ${contents.challenge}
${contents.result}
    `;
}

interface ClockProgressionRollContents {
  title: string;
  roll: string;
  result: string;
}

export function extractClockProgressionRollContents(
  roll: ClockProgressionRoll
): ClockProgressionRollContents {
  const title = roll.rollLabel;
  const rollResult = roll.roll + "";
  const result = roll.result.toLocaleUpperCase();

  return {
    title,
    roll: rollResult,
    result,
  };
}

export function convertClockProgressionRollToClipboardRich(
  contents: ClockProgressionRollContents
): string {
  const title = formatParagraph(contents.title);
  const roll = formatParagraph(formatItalic("Roll: ") + contents.roll);
  const result = formatBold(contents.result);

  return formatQuote(title + roll + result);
}

export function convertClockProgressionRollToClipboardPlain(
  contents: ClockProgressionRollContents
) {
  return `
${contents.title}
Roll: ${contents.roll}
${contents.result}
    `;
}
