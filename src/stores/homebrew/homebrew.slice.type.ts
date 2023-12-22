import { OracleTablesCollection } from "@datasworn/core";
import { PartialWithFieldValue, Unsubscribe } from "firebase/firestore";
import {
  BaseExpansion,
  BaseExpansionOrRuleset,
} from "types/homebrew/HomebrewCollection.type";
import { StoredRules } from "types/homebrew/HomebrewRules.type";

export interface HomebrewEntry {
  base: BaseExpansionOrRuleset;
  rules?: {
    data?: Partial<StoredRules>;
    loaded: boolean;
    error?: string;
  };
  oracles?: {
    data?: Record<string, OracleTablesCollection>;
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

  createExpansion: (expansion: BaseExpansion) => Promise<string>;
  updateExpansion: (
    expansionId: string,
    expansion: Partial<BaseExpansion>
  ) => Promise<void>;
  deleteExpansion: (expansionId: string) => Promise<void>;

  updateExpansionRules: (
    expansionId: string,
    rules: PartialWithFieldValue<StoredRules>
  ) => Promise<void>;

  updateExpansionOracles: (
    expansionId: string,
    oracles: PartialWithFieldValue<Record<string, OracleTablesCollection>>
  ) => Promise<void>;
}

export type HomebrewSlice = HomebrewSliceData & HomebrewSliceActions;
