import { getHomebrewMoveCollection } from "./_getRef";
import { createHomebrewListenerFunction } from "api-calls/homebrew/homebrewListenerFunction";

export const listenToHomebrewMoves = createHomebrewListenerFunction(
  getHomebrewMoveCollection()
);
