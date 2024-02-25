import { getHomebrewStatsCollection } from "./_getRef";
import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";

export const listenToHomebrewStats = createHomebrewListenerFunction(
  getHomebrewStatsCollection()
);
