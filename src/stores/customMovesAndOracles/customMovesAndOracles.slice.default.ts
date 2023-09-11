import { CustomMovesAndOraclesSliceData } from "./customMovesAndOracles.slice.type";

export const defaultCustomMovesAndOracles: CustomMovesAndOraclesSliceData = {
  customMoves: {},
  customOracles: {},

  delve: {
    showDelveMoves: true,
    showDelveOracles: true,
  },

  hiddenCustomMoveIds: [],
  hiddenCustomOracleIds: [],

  pinnedOraclesIds: {},
};
