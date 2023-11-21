import { useFeatureFlagEnabled } from "posthog-js/react";
import { useStore } from "stores/store";

export function useFeatureFlag(flag: string): boolean {
  const activeBetaTests = useStore((store) => store.appState.betaTests);
  const flagValue = useFeatureFlagEnabled(flag) ?? false;

  if (flag in activeBetaTests) {
    return activeBetaTests[flag];
  }

  return flagValue;
}
