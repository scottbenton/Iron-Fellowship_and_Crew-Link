import { LocationDocumentWithGMProperties } from "stores/world.slice";
import { Truth, World } from "types/World.type";
import { LocationsSlice } from "./locations/locations.slice.type";

export interface CurrentWorldSliceData {
  currentWorldId?: string;
  currentWorld?: World;

  doAnyDocsHaveImages: boolean;
  currentWorldLocations: LocationsSlice;
}

export interface CurrentWorldSliceActions {
  setCurrentWorldId: (worldId?: string) => void;
  updateCurrentWorld: (partialWorld: Partial<World>) => Promise<void>;
  updateCurrentWorldDescription: (
    description: string,
    isBeaconRequest?: boolean
  ) => Promise<void>;
  updateCurrentWorldTruth: (truthId: string, truth: Truth) => Promise<void>;
}

export type CurrentWorldSlice = CurrentWorldSliceData &
  CurrentWorldSliceActions;
