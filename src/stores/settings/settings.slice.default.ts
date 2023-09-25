import { SettingsSliceData } from "./settings.slice.type";

export const defaultSettings: SettingsSliceData = {
  customMoves: {},
  customOracles: {},
  customStats: [],

  delve: {
    showDelveMoves: true,
    showDelveOracles: true,
  },

  hiddenCustomMoveIds: [],
  hiddenCustomOracleIds: [],

  pinnedOraclesIds: {},
};
