import { getHomebrewConditionMeterCollection } from "./_getRef";
import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";

export const listenToHomebrewConditionMeters = createHomebrewListenerFunction(
  getHomebrewConditionMeterCollection()
);
