import { Datasworn } from "@datasworn/core";
import { HomebrewNonLinearMeterDocument } from "api-calls/homebrew/rules/nonLinearMeters/_homebrewNonLinearMeter.type";

export interface RulesSliceData {
  expansionIds: string[];
  baseRuleset?: Datasworn.Ruleset;
  mergedRuleset?: Datasworn.Ruleset;
  progressTracks: string[];
  rootOracleCollectionIds: string[];
  stats: Datasworn.Rules["stats"];
  conditionMeters: Datasworn.Rules["condition_meters"];
  nonLinearMeters: Record<string, HomebrewNonLinearMeterDocument>;
  specialTracks: Datasworn.Rules["special_tracks"];
  impacts: Datasworn.Rules["impacts"];
  assetMaps: {
    assetCollectionMap: Record<string, Datasworn.AssetCollection>;
    nonReplacedAssetCollectionMap: Record<string, Datasworn.AssetCollection>;
    assetMap: Record<string, Datasworn.Asset>;
  };
  oracleMaps: {
    allOraclesMap: Record<
      string,
      Datasworn.OracleRollable | Datasworn.OracleCollection
    >;
    oracleCollectionMap: Record<string, Datasworn.OracleCollection>;
    nonReplacedOracleCollectionMap: Record<string, Datasworn.OracleCollection>;
    oracleRollableMap: Record<string, Datasworn.OracleRollable>;
    nonReplacedOracleRollableMap: Record<string, Datasworn.OracleRollable>;
    oracleTableRollableMap: Record<string, Datasworn.OracleRollableTable>;
    nonReplacedOracleTableRollableMap: Record<
      string,
      Datasworn.OracleRollableTable
    >;
  };
  rootMoveCollectionIds: string[];
  moveMaps: {
    moveCategoryMap: Record<string, Datasworn.MoveCategory>;
    nonReplacedMoveCategoryMap: Record<string, Datasworn.MoveCategory>;
    moveMap: Record<string, Datasworn.Move>;
    nonReplacedMoveMap: Record<string, Datasworn.Move>;
  };
  worldTruths: Record<string, Datasworn.Truth>;
}

export interface RulesSliceActions {
  setBaseRuleset: (ruleset: Datasworn.Ruleset) => void;
  setExpansionIds: (expansionIds: string[]) => void;
  loadBaseRuleset: () => Promise<void>;
  loadIncludedExpansions: (expansionIds: string[]) => Promise<void>;
  rebuildNonLinearMeters: () => void;
  rebuildRules: () => void;
}

export type RulesSlice = RulesSliceData & RulesSliceActions;
