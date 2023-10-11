import { CreateSliceType } from "stores/store.type";
import { CurrentWorldSlice } from "./currentWorld.slice.type";
import { defaultCurrentWorldSlice } from "./currentWorld.default.type";
import { createLocationsSlice } from "./locations/locations.slice";
import { updateWorld } from "api-calls/world/updateWorld";
import { updateWorldDescription } from "api-calls/world/updateWorldDescription";
import { updateWorldTruth } from "api-calls/world/updateWorldTruth";
import { createNPCsSlice } from "./npcs/npcs.slice";
import { createLoreSlice } from "./lore/lore.slice";
import { createSectorSlice } from "./sector/sector.slice";

export const createCurrentWorldSlice: CreateSliceType<CurrentWorldSlice> = (
  ...params
) => {
  const [set, getState] = params;
  return {
    ...defaultCurrentWorldSlice,
    currentWorldLocations: createLocationsSlice(...params),
    currentWorldNPCs: createNPCsSlice(...params),
    currentWorldLore: createLoreSlice(...params),
    currentWorldSectors: createSectorSlice(...params),
    setCurrentWorldId: (worldId) => {
      const store = getState();
      const previousWorldId = store.worlds.currentWorld.currentWorldId;
      if (worldId && worldId !== previousWorldId) {
        store.worlds.currentWorld.resetStore();
        set((store) => {
          store.worlds.currentWorld.currentWorld =
            store.worlds.worldMap[worldId] ?? undefined;
          store.worlds.currentWorld.currentWorldId = worldId;
        });
      } else if (previousWorldId !== worldId) {
        store.worlds.currentWorld.resetStore();
      }
    },
    updateCurrentWorld: (partialWorld) => {
      const worldId = getState().worlds.currentWorld.currentWorldId;
      if (worldId) {
        return updateWorld({ worldId, partialWorld });
      } else
        return new Promise((res, reject) => {
          reject("No world id defined.");
        });
    },
    updateCurrentWorldDescription: (worldId, description, isBeaconRequest) => {
      return updateWorldDescription({
        worldId,
        description,
        isBeaconRequest,
      });
    },
    updateCurrentWorldTruth: (truthId, truth) => {
      const worldId = getState().worlds.currentWorld.currentWorldId;
      if (worldId) {
        return updateWorldTruth({
          worldId,
          truthId,
          truth,
        });
      } else {
        return new Promise((res, reject) => reject("No world id defined."));
      }
    },

    resetStore: () => {
      const state = getState();
      state.worlds.currentWorld.currentWorldLocations.resetStore();
      state.worlds.currentWorld.currentWorldNPCs.resetStore();
      state.worlds.currentWorld.currentWorldLore.resetStore();
      state.worlds.currentWorld.currentWorldSectors.resetStore();
      set((store) => {
        store.worlds.currentWorld = {
          ...store.worlds.currentWorld,
          ...defaultCurrentWorldSlice,
        };
      });
    },
  };
};
