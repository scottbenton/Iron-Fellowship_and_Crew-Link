import { useFeatureFlagEnabled } from "posthog-js/react";

export function useFeatureFlag(flag: string): boolean {
  const forcedGroups: { [groupName: string]: boolean } = JSON.parse(
    localStorage.getItem("forcedGroups") ?? "{}"
  );
  const flagValue = useFeatureFlagEnabled(flag) ?? false;

  if (flag in forcedGroups) {
    return forcedGroups[flag];
  }

  return flagValue;
}
