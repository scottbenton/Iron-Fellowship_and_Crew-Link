import { useFeatureFlag } from "./useFeatureFlag";

export function useNewCustomContentPage() {
  return useFeatureFlag("custom-content-page");
}
