import { Unsubscribe } from "firebase/firestore";
import { Roll } from "types/DieRolls.type";

export interface GameLogSliceData {
  logs: { [key: string]: Roll };
  totalLogsToLoad: number;
  loading: boolean;
}

export interface GameLogSliceActions {
  addRoll: (params: {
    campaignId?: string;
    characterId?: string;
    roll: Roll;
  }) => Promise<void>;
  updateRoll: (id: string, roll: Roll) => Promise<void>;

  loadMoreLogs: () => void;
  subscribe: (params: {
    campaignId?: string;
    characterId?: string;
    latestLoadedDate: Date;
  }) => Unsubscribe;

  resetStore: () => void;
}

export type GameLogSlice = GameLogSliceData & GameLogSliceActions;
