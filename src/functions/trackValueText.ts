// Text for screen readers that says what a stat, meter, track or clock holds.
// The boxes, ticks and segments these are drawn with are hidden from screen
// readers, so this text is the only way a blind player hears the value.

const TICKS_PER_BOX = 4;

/** A stat or meter value as it is shown: "+2", "0" or "-1". */
export function formatSignedValue(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

/** A progress or legacy track: "3 of 10 boxes filled, plus 2 ticks". */
export function getProgressTrackValueText(
  ticks: number,
  maxTicks: number,
): string {
  const boxes = Math.floor(ticks / TICKS_PER_BOX);
  const totalBoxes = Math.floor(maxTicks / TICKS_PER_BOX);
  const extraTicks = ticks % TICKS_PER_BOX;

  const boxText = `${boxes} of ${totalBoxes} boxes filled`;
  if (extraTicks === 0) {
    return boxText;
  }
  return `${boxText}, plus ${extraTicks} ${extraTicks === 1 ? "tick" : "ticks"}`;
}

/** A clock: "Doom, 3 of 6 segments filled". */
export function getClockValueText(
  label: string | undefined,
  filledSegments: number,
  segments: number,
): string {
  return `${label || "Clock"}, ${filledSegments} of ${segments} segments filled`;
}

/** Ironsworn experience: "5 experience earned, 2 spent, 3 unspent". */
export function getExperienceValueText(earned: number, spent: number): string {
  return `${earned} experience earned, ${spent} spent, ${earned - spent} unspent`;
}
