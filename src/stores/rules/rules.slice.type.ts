import { Datasworn } from "@datasworn/core";

export interface RulesSliceData {
  expansionIds: string[];
  baseRuleset?: Datasworn.Ruleset;
  rootOracleCollectionIds: string[];
  oracleMaps: {
    allOraclesMap: Record<
      string,
      Datasworn.OracleRollable | Datasworn.OracleCollection
    >;
    oracleCollectionMap: Record<string, Datasworn.OracleCollection>;
    oracleRollableMap: Record<string, Datasworn.OracleRollable>;
    oracleTableRollableMap: Record<string, Datasworn.OracleTableRollable>;
  };
  rootMoveCollectionIds: string[];
  moveMaps: {
    moveCategoryMap: Record<string, Datasworn.MoveCategory>;
    moveMap: Record<string, Datasworn.Move>;
  };
}

export interface RulesSliceActions {
  setExpansionIds: (expansionIds: string[]) => void;
  rebuildOracles: () => void;
}

export type RulesSlice = RulesSliceData & RulesSliceActions;
