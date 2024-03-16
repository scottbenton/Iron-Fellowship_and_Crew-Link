import { Datasworn } from "@datasworn/core";

export interface RulesSliceData {
  expansionIds: string[];
  baseRuleset?: Datasworn.Ruleset;
  progressTracks: string[];
  rootOracleCollectionIds: string[];
  stats: Datasworn.Rules["stats"];
  conditionMeters: Datasworn.Rules["condition_meters"];
  specialTracks: Datasworn.Rules["special_tracks"];
  impacts: Datasworn.Rules["impacts"];
  assetMaps: {
    assetCollectionMap: Record<string, Datasworn.AssetCollection>;
    assetMap: Record<string, Datasworn.Asset>;
  };
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
  rebuildMoves: () => void;
  rebuildStats: () => void;
  rebuildConditionMeters: () => void;
  rebuildSpecialTracks: () => void;
  rebuildImpacts: () => void;
}

export type RulesSlice = RulesSliceData & RulesSliceActions;
