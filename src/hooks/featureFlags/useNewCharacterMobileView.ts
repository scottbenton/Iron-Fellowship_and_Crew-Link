import { useFeatureFlag } from "./useFeatureFlag";

export function useNewCharacterMobileView() {
  return useFeatureFlag("character-mobile-view-updates");
}
