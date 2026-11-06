import { Dice } from "components/shared/Dice";

export interface DiceGroup {
  qty: number;
  sides: number;
  themeColor: string;
}

// The dice settle in about 1.5 seconds. Well past that, something is wrong.
const DICE_TIMEOUT_MS = 6000;

// Once the 3D dice have failed or stalled, later rolls skip them for the rest
// of the session, so a result is never held up by that wait twice.
let diceUnavailable = false;

export function markDiceUnavailable() {
  diceUnavailable = true;
}

function rollWithoutAnimation(groups: DiceGroup[]): number[] {
  return groups.flatMap((group) =>
    Array.from(
      { length: group.qty },
      () => Math.floor(Math.random() * group.sides) + 1
    )
  );
}

/**
 * Rolls each group of dice, in order, and returns every die's value.
 *
 * With animation on, the 3D dice roll them. If those fail or stall (WebGL can
 * be missing, blocked or slow, notably in iOS Safari), the values are rolled
 * without animation instead, so a roll is never lost or left waiting.
 */
export async function rollDice(
  groups: DiceGroup[],
  animate: boolean
): Promise<number[]> {
  if (!animate || diceUnavailable) {
    return rollWithoutAnimation(groups);
  }

  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    Dice.clear().show();
    setTimeout(() => {
      try {
        Dice.hide("fade-out");
      } catch {
        // Only the animation is lost.
      }
    }, 100);

    const results: { value: number }[] = await Promise.race([
      Dice.roll(groups),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error("3D dice timed out")),
          DICE_TIMEOUT_MS
        );
      }),
    ]);

    const values = results.map((result) => result.value);
    const expected = groups.reduce((total, group) => total + group.qty, 0);
    if (values.length !== expected || values.some((v) => !Number.isFinite(v))) {
      return rollWithoutAnimation(groups);
    }
    return values;
  } catch {
    markDiceUnavailable();
    try {
      Dice.clear();
    } catch {
      // The dice may never have started.
    }
    return rollWithoutAnimation(groups);
  } finally {
    clearTimeout(timeout);
  }
}
