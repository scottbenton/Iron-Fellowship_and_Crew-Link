import { Datasworn } from "@datasworn/core";
import { Unsubscribe } from "firebase/firestore";
import {
  ExpansionDocument,
  HomebrewCollectionDocument,
} from "types/homebrew/HomebrewCollection.type";
import {
  StoredOracleCollection,
  StoredOracleTable,
} from "types/homebrew/HomebrewOracles.type";
import {
  StoredConditionMeter,
  StoredImpact,
  StoredImpactCategory,
  StoredLegacyTrack,
  StoredStat,
} from "types/homebrew/HomebrewRules.type";

export interface HomebrewData<T> {
  data?: Record<string, T>;
  loaded: boolean;
  error?: string;
}

export interface HomebrewEntry {
  base: HomebrewCollectionDocument;

  stats?: HomebrewData<StoredStat>;
  conditionMeters?: HomebrewData<StoredConditionMeter>;
  impactCategories?: HomebrewData<StoredImpactCategory>;
  legacyTracks?: HomebrewData<StoredLegacyTrack>;

  oracleCollections?: HomebrewData<StoredOracleCollection>;
  oracleTables?: HomebrewData<StoredOracleTable>;

  dataswornOracles?: Record<string, Datasworn.OracleTablesCollection>;
}

export interface HomebrewSliceData {
  collections: Record<string, HomebrewEntry>;
  loading: boolean;
  error?: string;
}

export interface HomebrewSliceActions {
  subscribe: (uid: string) => Unsubscribe;
  subscribeToHomebrewContent: (homebrewIds: string[]) => Unsubscribe;

  createExpansion: (expansion: ExpansionDocument) => Promise<string>;
  updateExpansion: (
    expansionId: string,
    expansion: Partial<HomebrewCollectionDocument>
  ) => Promise<void>;
  deleteExpansion: (expansionId: string) => Promise<void>;

  createStat: (stat: StoredStat) => Promise<void>;
  updateStat: (statId: string, stat: StoredStat) => Promise<void>;
  deleteStat: (statId: string) => Promise<void>;

  createConditionMeter: (conditionMeter: StoredConditionMeter) => Promise<void>;
  updateConditionMeter: (
    conditionMeterId: string,
    conditionMeter: StoredConditionMeter
  ) => Promise<void>;
  deleteConditionMeter: (conditionMeterId: string) => Promise<void>;

  createImpactCategory: (category: StoredImpactCategory) => Promise<void>;
  updateImpactCategory: (
    impactCategoryId: string,
    impactCategory: StoredImpactCategory
  ) => Promise<void>;
  deleteImpactCategory: (impactCategoryId: string) => Promise<void>;
  updateImpact: (
    impactCategoryId: string,
    impact: StoredImpact
  ) => Promise<void>;
  deleteImpact: (impactCategoryId: string, impactId: string) => Promise<void>;

  createLegacyTrack: (legacyTrack: StoredLegacyTrack) => Promise<void>;
  updateLegacyTrack: (
    legacyTrackId: string,
    legacyTrack: StoredLegacyTrack
  ) => Promise<void>;
  deleteLegacyTrack: (legacyTrackId: string) => Promise<void>;

  createOracleCollection: (
    oracleCollection: StoredOracleCollection
  ) => Promise<void>;
  updateOracleCollection: (
    oracleCollectionId: string,
    oracleCollection: StoredOracleCollection
  ) => Promise<void>;
  deleteOracleCollection: (
    homebrewId: string,
    oracleCollectionId: string
  ) => Promise<void>;

  createOracleTable: (oracleTable: StoredOracleTable) => Promise<void>;
  updateOracleTable: (
    oracleTableId: string,
    oracleTable: StoredOracleTable
  ) => Promise<void>;
  deleteOracleTable: (oracleTableId: string) => Promise<void>;

  updateDataswornOracles: (homebrewId: string) => void;
}

export type HomebrewSlice = HomebrewSliceData & HomebrewSliceActions;
