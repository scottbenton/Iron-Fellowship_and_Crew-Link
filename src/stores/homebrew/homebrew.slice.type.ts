import { PartialWithFieldValue, Unsubscribe } from "firebase/firestore";
import {
  BaseExpansion,
  BaseExpansionOrRuleset,
  StoredRules,
} from "types/HomebrewCollection.type";

export interface HomebrewEntry {
  base: BaseExpansionOrRuleset;
  rules?: {
    data?: Partial<StoredRules>;
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
}

export type HomebrewSlice = HomebrewSliceData & HomebrewSliceActions;
