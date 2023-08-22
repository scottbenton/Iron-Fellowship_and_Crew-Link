import { DocumentSnapshot, Unsubscribe } from "firebase/firestore";
import { Roll } from "types/DieRolls.type";

export interface GameLogSliceData {
  logs: Roll[];
  newestLogDate?: Date;
  oldestLogDate?: Date;
  loading: boolean;
}

export interface GameLogSliceActions {
  addRoll: (params: {
    campaignId?: string;
    characterId?: string;
    roll: Roll;
  }) => Promise<void>;

  loadMoreLogs: () => void;
  subscribe: (params: {
    campaignId?: string;
    characterId?: string;
    latestLoadedDate: Date;
  }) => Unsubscribe;

  resetStore: () => void;
}

export type GameLogSlice = GameLogSliceData & GameLogSliceActions;
