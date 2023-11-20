import { CreateSliceType } from "stores/store.type";
import { SectorSlice } from "./sector.slice.type";
import { defaultSectorSlice } from "./sector.slice.default";
import { updateSector } from "api-calls/world/sectors/updateSector";
import { listenToSectors } from "api-calls/world/sectors/listenToSectors";
import { createSector } from "api-calls/world/sectors/createSector";
import { deleteSector } from "api-calls/world/sectors/deleteSector";
import { deleteField } from "firebase/firestore";
import { createSectorLocationsSlice } from "./sectorLocations/sectorLocations.slice";
import { listenToSectorNotes } from "api-calls/world/sectors/listenToSectorNotes";
import { updateSectorNotes } from "api-calls/world/sectors/updateSectorNotes";

export const createSectorSlice: CreateSliceType<SectorSlice> = (...params) => {
  const [set, getState] = params;
  return {
    locations: createSectorLocationsSlice(...params),
    ...defaultSectorSlice,

    setOpenSectorId: (sectorId) => {
      set((store) => {
        store.worlds.currentWorld.currentWorldSectors.openSectorId = sectorId;
      });
    },
    setSectorSearch: (search) => {
      set((store) => {
        store.worlds.currentWorld.currentWorldSectors.sectorSearch = search;
      });
    },
    setOpenSectorTab: (tab) => {
      set((store) => {
        store.worlds.currentWorld.currentWorldSectors.openSectorTab = tab;
      });
    },

    subscribe: (worldId, worldOwnerIds) => {
      const uid = getState().auth.uid;
      return listenToSectors(
        worldId,
        worldOwnerIds.includes(uid),
        (sectorId, sector) => {
          set((store) => {
            store.worlds.currentWorld.currentWorldSectors.sectors[sectorId] =
              sector;
          });
        },
        (sectorId) => {
          set((store) => {
            delete store.worlds.currentWorld.currentWorldSectors.sectors[
              sectorId
            ];
          });
        },
        (error) => console.error(error)
      );
    },

    createSector: () => {
      return new Promise((resolve, reject) => {
        const worldId = getState().worlds.currentWorld.currentWorldId;
        if (!worldId) {
          return new Promise((resolve, reject) => {
            reject("No world found");
          });
        }
        createSector({ worldId, shared: true })
          .then((sectorId) => {
            set((store) => {
              store.worlds.currentWorld.currentWorldSectors.openSectorId =
                sectorId;
            });
            resolve(sectorId);
          })
          .catch((e) => {
            reject(e);
          });
      });
    },

    updateSector: (sector) => {
      const state = getState();
      const worldId = state.worlds.currentWorld.currentWorldId;
      const openSectorId =
        state.worlds.currentWorld.currentWorldSectors.openSectorId;

      if (!worldId) {
        return new Promise((res, rej) => rej("No world open"));
      }

      if (!openSectorId) {
        return new Promise((res, rej) => rej("No sector open"));
      }

      return updateSector({
        worldId,
        sectorId: openSectorId,
        sector,
      });
    },
    updateName: (name) => {
      const state = getState();
      const worldId = state.worlds.currentWorld.currentWorldId;
      const openSectorId =
        state.worlds.currentWorld.currentWorldSectors.openSectorId;

      if (!worldId) {
        return new Promise((res, rej) => rej("No world open"));
      }

      if (!openSectorId) {
        return new Promise((res, rej) => rej("No sector open"));
      }

      return updateSector({
        worldId,
        sectorId: openSectorId,
        sector: {
          name,
        },
      });
    },

    updateHex: (row, col, content) => {
      const state = getState();
      const worldId = state.worlds.currentWorld.currentWorldId;
      const openSectorId =
        state.worlds.currentWorld.currentWorldSectors.openSectorId;

      if (!worldId) {
        return new Promise((res, rej) => rej("No world open"));
      }

      if (!openSectorId) {
        return new Promise((res, rej) => rej("No sector open"));
      }

      set((store) => {
        if (
          !store.worlds.currentWorld.currentWorldSectors.sectors[openSectorId]
            .map[row]
        ) {
          store.worlds.currentWorld.currentWorldSectors.sectors[
            openSectorId
          ].map[row] = {};
        }
        if (content) {
          store.worlds.currentWorld.currentWorldSectors.sectors[
            openSectorId
          ].map[row][col] = content;
        } else {
          delete store.worlds.currentWorld.currentWorldSectors.sectors[
            openSectorId
          ].map[row][col];
        }
      });

      return updateSector({
        worldId,
        sectorId: openSectorId,
        sector: {
          [`map.${row}.${col}`]: content ? content : deleteField(),
        },
      });
    },

    updateRegion: (region) => {
      const state = getState();
      const worldId = state.worlds.currentWorld.currentWorldId;
      const openSectorId =
        state.worlds.currentWorld.currentWorldSectors.openSectorId;

      if (!worldId) {
        return new Promise((res, rej) => rej("No world open"));
      }

      if (!openSectorId) {
        return new Promise((res, rej) => rej("No sector open"));
      }

      return updateSector({
        worldId,
        sectorId: openSectorId,
        sector: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          region: region ?? (deleteField() as any),
        },
      });
    },

    deleteSector: () => {
      const state = getState();
      const worldId = state.worlds.currentWorld.currentWorldId;
      const openSectorId =
        state.worlds.currentWorld.currentWorldSectors.openSectorId;

      if (!worldId) {
        return new Promise((res, rej) => rej("No world open"));
      }

      if (!openSectorId) {
        return new Promise((res, rej) => rej("No sector open"));
      }

      return deleteSector({
        worldId,
        sectorId: openSectorId,
      });
    },

    subscribeToSectorNotes: (sectorId, isPrivate) => {
      const worldId = getState().worlds.currentWorld.currentWorldId;

      if (!worldId) {
        return () => {};
      }

      return listenToSectorNotes(
        worldId,
        sectorId,
        (notes) => {
          set((store) => {
            store.worlds.currentWorld.currentWorldSectors[
              isPrivate ? "openSectorGMNotes" : "openSectorNotes"
            ] = notes;
          });
        },
        (error) => console.error(error),
        isPrivate
      );
    },

    updateSectorNotes: (sectorId, notes, isPrivate, isBeacon) => {
      const worldId = getState().worlds.currentWorld.currentWorldId;

      if (!worldId) {
        return new Promise((res, rej) => rej());
      }

      return updateSectorNotes({
        worldId,
        sectorId,
        notes,
        isPrivate,
        isBeacon,
      });
    },

    resetStoreNotes: () => {
      set((store) => {
        store.worlds.currentWorld.currentWorldSectors.openSectorGMNotes =
          undefined;
        store.worlds.currentWorld.currentWorldSectors.openSectorNotes =
          undefined;
      });
    },

    resetStore: () => {
      getState().worlds.currentWorld.currentWorldSectors.locations.resetStore();
      set((store) => {
        store.worlds.currentWorld.currentWorldSectors = {
          ...store.worlds.currentWorld.currentWorldSectors,
          ...defaultSectorSlice,
        };
      });
    },
  };
};
