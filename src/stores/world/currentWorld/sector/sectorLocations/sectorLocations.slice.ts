import { CreateSliceType } from "stores/store.type";
import { SectorLocationsSlice } from "./sectorLocations.slice.type";
import { defaultSectorLocationsSlice } from "./sectorLocations.slice.default";
import { createSectorLocation } from "api-calls/world/sectors/sectorLocations/createSectorLocation";
import { listenToSectorLocations } from "api-calls/world/sectors/sectorLocations/listenToSectorLocations";
import { updateSectorLocation } from "api-calls/world/sectors/sectorLocations/updateSectorLocation";
import { deleteSectorLocation } from "api-calls/world/sectors/sectorLocations/deleteSectorLocation";
import { listenToSectorLocationNotes } from "api-calls/world/sectors/sectorLocations/listenToSectorLocationNotes";
import { updateSectorLocationNotes } from "api-calls/world/sectors/sectorLocations/updateSectorLocationNotes";

export const createSectorLocationsSlice: CreateSliceType<
  SectorLocationsSlice
> = (set, getState) => ({
  ...defaultSectorLocationsSlice,

  setOpenLocationId: (sectorLocationId) => {
    set((store) => {
      store.worlds.currentWorld.currentWorldSectors.locations.openLocationId =
        sectorLocationId;
    });
  },

  subscribe: (worldId, sectorId) => {
    return listenToSectorLocations(
      worldId,
      sectorId,
      (locationId, location) => {
        set((store) => {
          store.worlds.currentWorld.currentWorldSectors.locations.locations[
            locationId
          ] = location;
        });
      },
      (locationId) => {
        set((store) => {
          delete store.worlds.currentWorld.currentWorldSectors.locations
            .locations[locationId];
        });
      },
      () => {}
    );
  },

  subscribeToLocationNotes: (locationId, isPrivate) => {
    const worlds = getState().worlds.currentWorld;
    const worldId = worlds.currentWorldId;
    const sectorId = worlds.currentWorldSectors.openSectorId;

    if (!worldId || !sectorId) {
      return () => {};
    }

    return listenToSectorLocationNotes(
      worldId,
      sectorId,
      locationId,
      (notes) => {
        set((store) => {
          store.worlds.currentWorld.currentWorldSectors.locations[
            isPrivate ? "openLocationGMNotes" : "openLocationNotes"
          ] = notes;
        });
      },
      (error) => console.error(error),
      isPrivate
    );
  },

  createLocation: (location) => {
    const worlds = getState().worlds.currentWorld;
    const worldId = worlds.currentWorldId;
    const sectorId = worlds.currentWorldSectors.openSectorId;

    if (!worldId || !sectorId) {
      return new Promise((resolve, reject) =>
        reject("World ID or Sector ID was not defined")
      );
    }

    return createSectorLocation({ worldId, sectorId, location });
  },

  updateLocation: (locationId, location) => {
    const worlds = getState().worlds.currentWorld;
    const worldId = worlds.currentWorldId;
    const sectorId = worlds.currentWorldSectors.openSectorId;

    if (!worldId || !sectorId) {
      return new Promise((resolve, reject) =>
        reject("World ID or Sector ID was not defined")
      );
    }

    return updateSectorLocation({
      worldId,
      sectorId,
      locationId,
      location,
    });
  },
  deleteLocation: (locationId) => {
    const worlds = getState().worlds.currentWorld;
    const worldId = worlds.currentWorldId;
    const sectorId = worlds.currentWorldSectors.openSectorId;

    if (!worldId || !sectorId) {
      return new Promise((resolve, reject) =>
        reject("World ID or Sector ID was not defined")
      );
    }

    let foundRow: number | undefined = undefined;
    let foundCol: number | undefined = undefined;

    const map = worlds.currentWorldSectors.openSectorId
      ? worlds.currentWorldSectors.sectors[
          worlds.currentWorldSectors.openSectorId
        ]?.map
      : undefined;

    if (map) {
      Object.keys(map).forEach((row) => {
        Object.keys(map[parseInt(row)] ?? {}).forEach((col) => {
          if (map[parseInt(row)]?.[parseInt(col)]?.locationId === locationId) {
            foundRow = parseInt(row);
            foundCol = parseInt(col);
          }
        });
      });
    }

    if (foundRow !== undefined && foundCol !== undefined) {
      return new Promise((resolve, reject) => {
        worlds.currentWorldSectors
          .updateHex(foundRow as number, foundCol as number, undefined)
          .then(() => {
            deleteSectorLocation({
              worldId,
              sectorId,
              locationId,
            })
              .then(resolve)
              .catch(reject);
          })
          .catch(reject);
      });
    }

    return deleteSectorLocation({
      worldId,
      sectorId,
      locationId,
    });
  },

  updateLocationNotes: (locationId, notes, isPrivate, isBeacon) => {
    const worlds = getState().worlds.currentWorld;
    const worldId = worlds.currentWorldId;
    const sectorId = worlds.currentWorldSectors.openSectorId;

    if (!worldId || !sectorId) {
      return new Promise((resolve, reject) =>
        reject("World ID or Sector ID was not defined")
      );
    }

    return updateSectorLocationNotes({
      worldId,
      sectorId,
      locationId,
      notes,
      isPrivate,
      isBeacon,
    });
  },

  resetStoreNotes: () => {
    set((store) => {
      store.worlds.currentWorld.currentWorldSectors.locations.openLocationNotes =
        undefined;
      store.worlds.currentWorld.currentWorldSectors.locations.openLocationGMNotes =
        undefined;
    });
  },

  resetStore: () => {
    set((store) => {
      store.worlds.currentWorld.currentWorldSectors.locations = {
        ...store.worlds.currentWorld.currentWorldSectors.locations,
        ...defaultSectorLocationsSlice,
      };
    });
  },
});
