import { Datasworn } from "@datasworn/core";
import { PartialWithFieldValue, Unsubscribe } from "firebase/firestore";
import { HomebrewAssetDocument } from "api-calls/homebrew/assets/assets/_homebrewAssets.type";
import { HomebrewAssetCollectionDocument } from "api-calls/homebrew/assets/collections/_homebrewAssetCollection.type";
import {
  ExpansionDocument,
  HomebrewCollectionDocument,
} from "api-calls/homebrew/_homebrewCollection.type";
import { HomebrewMoveDocument } from "api-calls/homebrew/moves/moves/_homebrewMove.type";
import { HomebrewMoveCategoryDocument } from "api-calls/homebrew/moves/categories/_homebrewMoveCategory.type";
import { HomebrewOracleTableDocument } from "api-calls/homebrew/oracles/tables/_homebrewOracleTable.type";
import { HomebrewOracleCollectionDocument } from "api-calls/homebrew/oracles/collections/_homebrewOracleCollection.type";
import { HomebrewStatDocument } from "api-calls/homebrew/rules/stats/_homebrewStat.type";
import { HomebrewNonLinearMeterDocument } from "api-calls/homebrew/rules/nonLinearMeters/_homebrewNonLinearMeter.type";
import { HomebrewImpact } from "api-calls/homebrew/rules/impacts/_homebrewImpacts.type";
import { HomebrewLegacyTrackDocument } from "api-calls/homebrew/rules/legacyTracks/_homebrewLegacyTrack.type";
import { HomebrewImpactCategoryDocument } from "api-calls/homebrew/rules/impacts/_homebrewImpacts.type";
import { HomebrewConditionMeterDocument } from "api-calls/homebrew/rules/conditionMeters/_homebrewConditionMeters.type";

export interface HomebrewData<T> {
  data?: Record<string, T>;
  loaded: boolean;
  error?: string;
}

export interface HomebrewEntry {
  base: HomebrewCollectionDocument;

  stats?: HomebrewData<HomebrewStatDocument>;
  conditionMeters?: HomebrewData<HomebrewConditionMeterDocument>;
  nonLinearMeters?: HomebrewData<HomebrewNonLinearMeterDocument>;
  impactCategories?: HomebrewData<HomebrewImpactCategoryDocument>;
  legacyTracks?: HomebrewData<HomebrewLegacyTrackDocument>;

  oracleCollections?: HomebrewData<HomebrewOracleCollectionDocument>;
  oracleTables?: HomebrewData<HomebrewOracleTableDocument>;

  moveCategories?: HomebrewData<HomebrewMoveCategoryDocument>;
  moves?: HomebrewData<HomebrewMoveDocument>;

  assetCollections?: HomebrewData<HomebrewAssetCollectionDocument>;
  assets?: HomebrewData<HomebrewAssetDocument>;
}

export interface HomebrewSliceData {
  sortedHomebrewCollectionIds: string[];
  collections: Record<string, HomebrewEntry>;
  expansions: Record<string, Datasworn.Expansion>;
  loading: boolean;
  error?: string;
}

export interface HomebrewSliceActions {
  subscribe: (uid: string) => Unsubscribe;
  subscribeToHomebrewContent: (homebrewIds: string[]) => Unsubscribe;

  createExpansion: (expansion: ExpansionDocument) => Promise<string>;
  updateExpansion: (
    expansionId: string,
    expansion: PartialWithFieldValue<HomebrewCollectionDocument>
  ) => Promise<void>;
  deleteExpansion: (expansionId: string) => Promise<void>;

  createStat: (stat: HomebrewStatDocument) => Promise<void>;
  updateStat: (statId: string, stat: HomebrewStatDocument) => Promise<void>;
  deleteStat: (statId: string) => Promise<void>;

  createConditionMeter: (
    conditionMeter: HomebrewConditionMeterDocument
  ) => Promise<void>;
  updateConditionMeter: (
    conditionMeterId: string,
    conditionMeter: HomebrewConditionMeterDocument
  ) => Promise<void>;
  deleteConditionMeter: (conditionMeterId: string) => Promise<void>;

  createNonLinearMeter: (
    meter: HomebrewNonLinearMeterDocument
  ) => Promise<void>;
  updateNonLinearMeter: (
    meterId: string,
    meter: HomebrewNonLinearMeterDocument
  ) => Promise<void>;
  deleteNonLinearMeter: (meterId: string) => Promise<void>;

  createImpactCategory: (
    category: HomebrewImpactCategoryDocument
  ) => Promise<void>;
  updateImpactCategory: (
    impactCategoryId: string,
    impactCategory: HomebrewImpactCategoryDocument
  ) => Promise<void>;
  deleteImpactCategory: (impactCategoryId: string) => Promise<void>;
  updateImpact: (
    impactCategoryId: string,
    impact: HomebrewImpact
  ) => Promise<void>;
  deleteImpact: (impactCategoryId: string, impactId: string) => Promise<void>;

  createLegacyTrack: (
    legacyTrack: HomebrewLegacyTrackDocument
  ) => Promise<void>;
  updateLegacyTrack: (
    legacyTrackId: string,
    legacyTrack: HomebrewLegacyTrackDocument
  ) => Promise<void>;
  deleteLegacyTrack: (legacyTrackId: string) => Promise<void>;

  createOracleCollection: (
    oracleCollection: HomebrewOracleCollectionDocument
  ) => Promise<void>;
  updateOracleCollection: (
    oracleCollectionId: string,
    oracleCollection: PartialWithFieldValue<HomebrewOracleCollectionDocument>
  ) => Promise<void>;
  deleteOracleCollection: (
    homebrewId: string,
    oracleCollectionId: string
  ) => Promise<void>;

  createOracleTable: (
    oracleTable: HomebrewOracleTableDocument
  ) => Promise<void>;
  updateOracleTable: (
    oracleTableId: string,
    oracleTable: PartialWithFieldValue<HomebrewOracleTableDocument>
  ) => Promise<void>;
  deleteOracleTable: (oracleTableId: string) => Promise<void>;

  createMoveCategory: (
    moveCategory: HomebrewMoveCategoryDocument
  ) => Promise<void>;
  updateMoveCategory: (
    moveCategoryId: string,
    moveCategory: HomebrewMoveCategoryDocument
  ) => Promise<void>;
  deleteMoveCategory: (
    homebrewId: string,
    moveCategoryId: string
  ) => Promise<void>;

  createMove: (move: HomebrewMoveDocument) => Promise<void>;
  updateMove: (
    moveId: string,
    move: PartialWithFieldValue<HomebrewMoveDocument>
  ) => Promise<void>;
  deleteMove: (moveId: string) => Promise<void>;

  createAssetCollection: (
    assetCollection: HomebrewAssetCollectionDocument
  ) => Promise<void>;
  updateAssetCollection: (
    assetCollectionId: string,
    assetCollection: HomebrewAssetCollectionDocument
  ) => Promise<void>;
  deleteAssetCollection: (
    homebrewId: string,
    assetCollectionId: string
  ) => Promise<void>;

  createAsset: (asset: HomebrewAssetDocument) => Promise<void>;
  updateAsset: (
    assetId: string,
    asset: PartialWithFieldValue<HomebrewAssetDocument>
  ) => Promise<void>;
  deleteAsset: (assetId: string) => Promise<void>;

  updateExpansionIfLoaded: (expansionId: string) => void;
}

export type HomebrewSlice = HomebrewSliceData & HomebrewSliceActions;
