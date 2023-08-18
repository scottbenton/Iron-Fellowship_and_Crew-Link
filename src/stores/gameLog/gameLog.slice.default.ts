import { GameLogSliceData } from "./gameLog.slice.type";

export const defaultGameLogSlice: GameLogSliceData = {
  logs: [],
  newestLogDate: undefined,
  oldestLogDate: undefined,
  loading: false,
};
