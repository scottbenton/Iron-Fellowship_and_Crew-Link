import { getHomebrewImpactsCollection } from "./_getRef";
import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";

export const listenToHomebrewImpacts = createHomebrewListenerFunction(
  getHomebrewImpactsCollection()
);
