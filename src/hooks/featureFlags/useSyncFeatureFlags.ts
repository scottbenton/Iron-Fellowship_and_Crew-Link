import { useEffect, useRef } from "react";
import { useStore } from "stores/store";

export function useSyncFeatureFlags() {
  const betaTests = useStore((store) => store.appState.betaTests);
  const updateBetaTests = useStore((store) => store.appState.updateBetaTests);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const localStorageResults: { [group: string]: boolean } = JSON.parse(
      localStorage.getItem("forcedGroups") ?? "{}"
    );
    updateBetaTests(localStorageResults);
  }, [updateBetaTests]);

  useEffect(() => {
    if (!isInitialLoad.current) {
      localStorage.setItem("forcedGroups", JSON.stringify(betaTests));
    } else {
      isInitialLoad.current = false;
    }
  }, [betaTests]);
}
