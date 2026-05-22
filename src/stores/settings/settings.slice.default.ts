import { SettingsSliceData } from "./settings.slice.type";

export const defaultSettings: SettingsSliceData = {
  customMoves: {},
  customOracles: {},
  customStats: [],
  customTracks: [],

  delve: {
    showDelveOracles: true,
  },

  hiddenCustomMoveIds: [],
  hiddenCustomOracleIds: [],

  pinnedOraclesIds: {},
};
