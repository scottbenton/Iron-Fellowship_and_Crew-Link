import { useFeatureFlag } from "./useFeatureFlag";

export function useNewLayout() {
  return useFeatureFlag("new-layout");
}
