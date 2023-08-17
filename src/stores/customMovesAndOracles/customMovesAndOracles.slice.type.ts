import { Unsubscribe } from "firebase/firestore";
import { StoredMove } from "types/Moves.type";
import { StoredOracle } from "types/Oracles.type";

export interface CustomMovesAndOraclesSliceData {
  customMoves: {
    [uid: string]: StoredMove[];
  };
  customOracles: {
    [uid: string]: StoredOracle[];
  };

  hiddenCustomMoveIds: string[];
  hiddenCustomOracleIds: string[];

  pinnedOraclesIds: { [oracleId: string]: boolean };
}

export interface CustomMovesAndOraclesSliceActions {
  subscribe: (userIds: string[]) => Unsubscribe;
  subscribeToSettings: (params: {
    characterId?: string;
    campaignId?: string;
  }) => Unsubscribe;

  subscribeToPinnedOracleSettings: (uid: string) => Unsubscribe;

  toggleCustomMoveVisibility: (
    moveId: string,
    hidden: boolean
  ) => Promise<void>;
  toggleCustomOracleVisibility: (
    oracleId: string,
    hidden: boolean
  ) => Promise<void>;

  addCustomMove: (move: StoredMove) => Promise<void>;
  updateCustomMove: (moveId: string, move: StoredMove) => Promise<void>;
  removeCustomMove: (moveId: string) => Promise<void>;

  addCustomOracle: (oracle: StoredOracle) => Promise<void>;
  updateCustomOracle: (oracleId: string, oracle: StoredOracle) => Promise<void>;
  removeCustomOracle: (oracleId: string) => Promise<void>;

  togglePinnedOracle: (oracleId: string, pinned: boolean) => Promise<void>;

  resetStore: () => void;
}

export type CustomMovesAndOraclesSlice = CustomMovesAndOraclesSliceData &
  CustomMovesAndOraclesSliceActions;
