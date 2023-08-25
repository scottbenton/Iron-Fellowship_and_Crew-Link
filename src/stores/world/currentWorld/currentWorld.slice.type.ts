import { Truth, World } from "types/World.type";
import { LocationsSlice } from "./locations/locations.slice.type";
import { NPCsSlice } from "./npcs/npcs.slice.type";
import { LoreSlice } from "./lore/lore.slice.type";

export interface CurrentWorldSliceData {
  currentWorldId?: string;
  currentWorld?: World;

  doAnyDocsHaveImages: boolean;
  currentWorldLocations: LocationsSlice;
  currentWorldNPCs: NPCsSlice;
  currentWorldLore: LoreSlice;
}

export interface CurrentWorldSliceActions {
  setCurrentWorldId: (worldId?: string) => void;
  updateCurrentWorld: (partialWorld: Partial<World>) => Promise<void>;
  updateCurrentWorldDescription: (
    worldId: string,
    description: Uint8Array,
    isBeaconRequest?: boolean
  ) => Promise<void>;
  updateCurrentWorldTruth: (truthId: string, truth: Truth) => Promise<void>;

  resetStore: () => void;
}

export type CurrentWorldSlice = CurrentWorldSliceData &
  CurrentWorldSliceActions;
