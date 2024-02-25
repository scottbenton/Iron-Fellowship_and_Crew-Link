import { getHomebrewLegacyTrackCollection } from "./_getRef";
import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";

export const listenToHomebrewLegacyTracks = createHomebrewListenerFunction(
  getHomebrewLegacyTrackCollection()
);
