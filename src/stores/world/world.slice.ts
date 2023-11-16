import { CreateSliceType } from "stores/store.type";
import { WorldSlice } from "./world.slice.type";
import { defaultWorldSlice } from "./world.slice.default";
import { listenToUsersWorlds } from "api-calls/world/listenToUsersWorlds";
import { listenToWorld } from "api-calls/world/listenToWorld";
import { createWorld } from "api-calls/world/createWorld";
import { createCurrentWorldSlice } from "./currentWorld/currentWorld.slice";
import { deleteWorld } from "api-calls/world/deleteWorld";

export const createWorldSlice: CreateSliceType<WorldSlice> = (...params) => {
  const [set, getState] = params;
  return {
    ...defaultWorldSlice,
    currentWorld: createCurrentWorldSlice(...params),

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
              if (worldId === store.worlds.currentWorld.currentWorldId) {
                store.worlds.currentWorld.currentWorld = world;
              }
            });
          },
          onDocRemove: (worldId) => {
            set((store) => {
              delete store.worlds.worldMap[worldId];
              if (worldId === store.worlds.currentWorld.currentWorldId) {
                store.worlds.currentWorld.currentWorld = undefined;
              }
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
          set((store) => {
            store.worlds.error = "Failed to load worlds.";
          });
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
                if (worldId === store.worlds.currentWorld.currentWorldId) {
                  store.worlds.currentWorld.currentWorld = world;
                }
              } else {
                delete store.worlds.worldMap[worldId];
                if (worldId === store.worlds.currentWorld.currentWorldId) {
                  store.worlds.currentWorld.currentWorld = undefined;
                }
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
    createWorld: () => {
      const uid = getState().auth.uid;
      return createWorld({ name: "New World", ownerIds: [uid] });
    },
    deleteWorld: (worldId) => {
      return deleteWorld(worldId);
    },
  };
};
