import { Unsubscribe } from "firebase/firestore";
import {
  ExpansionDocument,
  HomebrewCollectionDocument,
} from "types/homebrew/HomebrewCollection.type";
import { HomebrewOracleCollection } from "types/homebrew/HomebrewOracles.type";
import {
  StoredConditionMeter,
  StoredImpact,
  StoredImpactCategory,
  StoredLegacyTrack,
  StoredStat,
} from "types/homebrew/HomebrewRules.type";

export interface HomebrewEntry {
  base: HomebrewCollectionDocument;
  stats?: {
    data?: Record<string, StoredStat>;
    loaded: boolean;
    error?: string;
  };
  conditionMeters?: {
    data?: Record<string, StoredConditionMeter>;
    loaded: boolean;
    error?: string;
  };
  impactCategories?: {
    data?: Record<string, StoredImpactCategory>;
    loaded: boolean;
    error?: string;
  };
  oracles?: {
    data?: Record<string, HomebrewOracleCollection>;
    loaded: boolean;
    error?: string;
  };
  legacyTracks?: {
    data?: Record<string, StoredLegacyTrack>;
    loaded: boolean;
    error?: string;
  };
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
}

export type HomebrewSlice = HomebrewSliceData & HomebrewSliceActions;
