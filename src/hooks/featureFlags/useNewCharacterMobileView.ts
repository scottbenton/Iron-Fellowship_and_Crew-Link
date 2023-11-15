import { useFeatureFlagEnabled } from "posthog-js/react";

export function useNewCharacterMobileView() {
  const isFeatureFlagEnabled =
    useFeatureFlagEnabled("character-mobile-view-updates") ?? false;

  return isFeatureFlagEnabled;
}
