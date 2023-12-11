import { Unsubscribe } from "firebase/firestore";
import {
  BaseExpansion,
  BaseExpansionOrRuleset,
} from "types/HomebrewCollection.type";

export interface HomebrewSliceData {
  collections: Record<string, BaseExpansionOrRuleset>;
  loading: boolean;
  error?: string;
}

export interface HomebrewSliceActions {
  subscribe: (uid: string) => Unsubscribe;

  createExpansion: (expansion: BaseExpansion) => Promise<string>;
  updateExpansion: (
    expansionId: string,
    expansion: Partial<BaseExpansion>
  ) => Promise<void>;
  deleteExpansion: (expansionId: string) => Promise<void>;
}

export type HomebrewSlice = HomebrewSliceData & HomebrewSliceActions;
