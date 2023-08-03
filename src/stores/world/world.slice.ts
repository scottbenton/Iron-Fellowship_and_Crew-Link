import { CreateSliceType } from "stores/store.type";
import { WorldSlice } from "./world.slice.type";
import { defaultWorldSlice } from "./world.slice.default";
import { listenToUsersWorlds } from "api-calls/world/listenToUsersWorlds";
import { getErrorMessage } from "functions/getErrorMessage";
import { listenToWorld } from "api-calls/world/listenToWorld";
import { createWorld } from "api-calls/world/createWorld";

export const createWorldSlice: CreateSliceType<WorldSlice> = (
  set,
  getState
) => ({
  ...defaultWorldSlice,
  subscribeToOwnedWorlds: (uid) => {
    if (!uid) {
      return undefined;
    }
    return listenToUsersWorlds(
      uid,
      {
        onDocChange: (worldId, world) => {
          set((store) => {
            store.worlds.worldMap[worldId] = world;
          });
        },
        onDocRemove: (worldId) => {
          set((store) => {
            delete store.worlds.worldMap[worldId];
          });
        },
        onLoaded: () => {
          set((store) => {
            store.worlds.loading = false;
          });
        },
      },
      (error) => {
        console.error(error);
        set((store) => (store.worlds.error = "Failed to load worlds."));
      }
    );
  },
  subscribeToNonOwnedWorlds: (campaignWorldIds, userOwnedWorldIds) => {
    const worldIdsToLoad = campaignWorldIds.filter(
      (worldId) => !userOwnedWorldIds.includes(worldId)
    );

    const unsubscribes = worldIdsToLoad.map((worldId) =>
      listenToWorld(
        worldId,
        (world) => {
          set((store) => {
            if (world) {
              store.worlds.worldMap[worldId] = world;
            } else {
              delete store.worlds.worldMap[worldId];
            }
          });
        },
        (error) => {
          console.error(error);
        }
      )
    );

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  },
  createWorld: (world) => {
    return createWorld(world);
  },
});
