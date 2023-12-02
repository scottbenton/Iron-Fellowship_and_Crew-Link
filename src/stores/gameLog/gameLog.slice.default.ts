import { GameLogSliceData } from "./gameLog.slice.type";

const DEFAULT_LOGS_TO_LOAD = 20;

export const defaultGameLogSlice: GameLogSliceData = {
  logs: {},
  totalLogsToLoad: DEFAULT_LOGS_TO_LOAD,
  loading: false,
};
