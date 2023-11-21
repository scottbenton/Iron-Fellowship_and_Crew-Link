import { useFeatureFlag } from "./useFeatureFlag";

export function useNewMoveOracleView() {
  return useFeatureFlag("new-move-oracle-view");
}
