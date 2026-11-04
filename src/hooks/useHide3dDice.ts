import { useMediaQuery } from "@mui/material";
import { useStore } from "stores/store";

/**
 * Whether to skip the animated 3D dice, given the person's own choice (if
 * they made one) and what their settings suggest.
 *
 * A browser won't say whether a screen reader is running, so the dice are
 * skipped by default for people who ask their device to reduce motion, or who
 * turned on read-out roll results in Accessibility Settings. The animation
 * only delays the result for them. Choosing to show or hide the dice wins.
 */
export function shouldHide3dDice(
  choice: boolean | undefined,
  prefersReducedMotion: boolean,
  readsRollResults: boolean
): boolean {
  if (choice !== undefined) {
    return choice;
  }
  return prefersReducedMotion || readsRollResults;
}

export function useHide3dDice(): boolean {
  const choice = useStore((store) => store.auth.userDoc?.hide3dDice);
  const readsRollResults = useStore(
    (store) =>
      store.accessibilitySettings.settings.verboseRollResults ?? false
  );
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
    { noSsr: true }
  );

  return shouldHide3dDice(choice, prefersReducedMotion, readsRollResults);
}
