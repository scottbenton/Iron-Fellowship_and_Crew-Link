import { CreateSliceType } from "stores/store.type";
import { SectorSlice } from "./sector.slice.type";
import { defaultSectorSlice } from "./sector.slice.default";
import { updateSector } from "api-calls/world/sectors/updateSector";
import { listenToSectors } from "api-calls/world/sectors/listenToSectors";
import { createSector } from "api-calls/world/sectors/createSector";
import { deleteSector } from "api-calls/world/sectors/deleteSector";
import { deleteField } from "firebase/firestore";

export const createSectorSlice: CreateSliceType<SectorSlice> = (
  set,
  getState
) => ({
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

  updateHex: (row, col, type) => {
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
        store.worlds.currentWorld.currentWorldSectors.sectors[openSectorId].map[
          row
        ] = {};
      }
      store.worlds.currentWorld.currentWorldSectors.sectors[openSectorId].map[
        row
      ][col] = {
        type,
      };
    });

    return updateSector({
      worldId,
      sectorId: openSectorId,
      sector: {
        [`map.${row}.${col}`]: {
          type,
        },
      },
    });
  },

  updateRegion: (region) => {
    const state = getState();
    console.debug("setting region", region);
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
});
