import { Unsubscribe } from "firebase/firestore";
import { World } from "types/World.type";
import { CurrentWorldSlice } from "./currentWorld/currentWorld.slice.type";

export interface WorldSliceData {
  worldMap: { [worldId: string]: World };
  error?: string;
  loading: boolean;

  currentWorld: CurrentWorldSlice;
}

export interface WorldSliceActions {
  subscribeToOwnedWorlds: (uid?: string) => Unsubscribe | undefined;
  subscribeToNonOwnedWorlds: (
    campaignWorldIds: string[],
    worldIdsUserOwns: string[]
  ) => Unsubscribe | undefined;

  createWorld: (world: World) => Promise<string>;
  deleteWorld: (worldId: string) => Promise<void>;
}

export type WorldSlice = WorldSliceData & WorldSliceActions;
