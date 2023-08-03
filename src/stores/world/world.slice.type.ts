import { Unsubscribe } from "firebase/firestore";
import { World } from "types/World.type";

export interface WorldSliceData {
  worldMap: { [worldId: string]: World };
  error?: string;
  loading: boolean;
}

export interface WorldSliceActions {
  subscribeToOwnedWorlds: (uid?: string) => Unsubscribe | undefined;
  subscribeToNonOwnedWorlds: (
    campaignWorldIds: string[],
    worldIdsUserOwns: string[]
  ) => Unsubscribe | undefined;

  createWorld: (world: World) => Promise<string>;
}

export type WorldSlice = WorldSliceData & WorldSliceActions;
