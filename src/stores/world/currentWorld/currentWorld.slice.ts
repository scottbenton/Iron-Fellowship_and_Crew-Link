import { CreateSliceType } from "stores/store.type";
import { CurrentWorldSlice } from "./currentWorld.slice.type";
import { defaultCurrentWorldSlice } from "./currentWorld.default.type";
import { createLocationsSlice } from "./locations/locations.slice";
import { defaultLocationsSlice } from "./locations/locations.slice.default";
import { updateWorld } from "api-calls/world/updateWorld";
import { updateWorldDescription } from "api-calls/world/updateWorldDescription";
import { updateWorldTruth } from "api-calls/world/updateWorldTruth";
import { createNPCsSlice } from "./npcs/npcs.slice";
import { defaultNPCsSlice } from "./npcs/npcs.slice.default";
import { createLoreSlice } from "./lore/lore.slice";
import { defaultLoreSlice } from "./lore/lore.slice.default";

export const createCurrentWorldSlice: CreateSliceType<CurrentWorldSlice> = (
  ...params
) => {
  const [set, getState] = params;
  return {
    ...defaultCurrentWorldSlice,
    currentWorldLocations: createLocationsSlice(...params),
    currentWorldNPCs: createNPCsSlice(...params),
    currentWorldLore: createLoreSlice(...params),
    setCurrentWorldId: (worldId) => {
      set((store) => {
        store.worlds.currentWorld.currentWorldId = worldId;
        if (worldId) {
          store.worlds.currentWorld.currentWorld =
            store.worlds.worldMap[worldId];
        } else {
          store.worlds.currentWorld = {
            ...store.worlds.currentWorld,
            ...defaultCurrentWorldSlice,
          };
        }
        store.worlds.currentWorld.currentWorldLocations = {
          ...store.worlds.currentWorld.currentWorldLocations,
          ...defaultLocationsSlice,
        };
        store.worlds.currentWorld.currentWorldNPCs = {
          ...store.worlds.currentWorld.currentWorldNPCs,
          ...defaultNPCsSlice,
        };
        store.worlds.currentWorld.currentWorldLore = {
          ...store.worlds.currentWorld.currentWorldLore,
          ...defaultLoreSlice,
        };
      });
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
    updateCurrentWorldDescription: (description, isBeaconRequest) => {
      const worldId = getState().worlds.currentWorld.currentWorldId;
      if (worldId) {
        return updateWorldDescription({
          worldId,
          description,
          isBeaconRequest,
        });
      } else {
        return new Promise((res, reject) => reject("No world id defined."));
      }
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
  };
};
