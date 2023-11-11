import { CreateSliceType } from "stores/store.type";
import { LocationsSlice } from "./locations.slice.type";
import { defaultLocationsSlice } from "./locations.slice.default";
import { listenToLocations } from "api-calls/world/locations/listenToLocations";
import { createLocation } from "api-calls/world/locations/createLocation";
import { deleteLocation } from "api-calls/world/locations/deleteLocation";
import { updateLocation } from "api-calls/world/locations/updateLocation";
import { updateLocationGMNotes } from "api-calls/world/locations/updateLocationGMNotes";
import { updateLocationGMProperties } from "api-calls/world/locations/updateLocationGMProperties";
import { updateLocationNotes } from "api-calls/world/locations/updateLocationNotes";
import { uploadLocationImage } from "api-calls/world/locations/uploadLocationImage";
import { listenToLocationNotes } from "api-calls/world/locations/listenToLocationNotes";
import { reportApiError } from "lib/analytics.lib";
import { Unsubscribe } from "firebase/firestore";
import { listenToLocationGMProperties } from "api-calls/world/locations/listenToLocationGMProperties";
import { updateLocationCharacterBond } from "api-calls/world/locations/updateLocationCharacterBond";
import { removeLocationImage } from "api-calls/world/locations/removeLocationImage";

export const createLocationsSlice: CreateSliceType<LocationsSlice> = (
  set,
  getState
) => ({
  ...defaultLocationsSlice,
  subscribe: (currentWorldId: string, currentWorldOwnerIds: string[]) => {
    const uid = getState().auth.uid;
    const isWorldOwner = currentWorldOwnerIds.includes(uid);

    return listenToLocations(
      currentWorldId,
      isWorldOwner,
      (locationId, location) => {
        set((store) => {
          if (
            Array.isArray(location.imageFilenames) &&
            location.imageFilenames?.length > 0
          ) {
            store.worlds.currentWorld.doAnyDocsHaveImages = true;
          }
          const existingLocation =
            store.worlds.currentWorld.currentWorldLocations.locationMap[
              locationId
            ];
          const gmProperties = existingLocation?.gmProperties;
          const notes = existingLocation?.notes;
          const imageUrl =
            (location.imageFilenames?.length ?? 0) > 0
              ? existingLocation?.imageUrl
              : undefined;
          store.worlds.currentWorld.currentWorldLocations.locationMap[
            locationId
          ] = { ...location, gmProperties, notes, imageUrl };
        });
      },
      (locationId, imageUrl) => {
        set((store) => {
          store.worlds.currentWorld.currentWorldLocations.locationMap[
            locationId
          ].imageUrl = imageUrl;
        });
      },
      (locationId) => {
        set((store) => {
          delete store.worlds.currentWorld.currentWorldLocations.locationMap[
            locationId
          ];
        });
      },
      (error) => {
        set((store) => {
          store.worlds.currentWorld.currentWorldLocations.error = error;
        });
      }
    );
  },
  setOpenLocationId: (locationId) => {
    set((store) => {
      store.worlds.currentWorld.currentWorldLocations.openLocationId =
        locationId;
    });
  },
  setLocationSearch: (search) => {
    set((store) => {
      store.worlds.currentWorld.currentWorldLocations.locationSearch = search;
    });
  },

  createLocation: () => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return createLocation({ worldId });
  },
  deleteLocation: (locationId) => {
    const currentWorld = getState().worlds.currentWorld;
    const worldId = currentWorld.currentWorldId;
    const imageFilename =
      currentWorld.currentWorldLocations.locationMap[locationId]
        ?.imageFilenames?.[0];
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return deleteLocation({ worldId, locationId, imageFilename });
  },
  updateLocation: (locationId, partialLocation) => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return updateLocation({ worldId, locationId, location: partialLocation });
  },
  updateLocationGMNotes: (locationId, notes, isBeacon) => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return updateLocationGMNotes({ worldId, locationId, notes, isBeacon });
  },
  updateLocationGMProperties: (locationId, locationGMProperties) => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return updateLocationGMProperties({
      worldId,
      locationId,
      locationGMProperties,
    });
  },
  updateLocationNotes: (locationId, notes, isBeacon) => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return updateLocationNotes({ worldId, locationId, notes, isBeacon });
  },
  updateLocationCharacterBond: (locationId, characterId, bonded) => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return updateLocationCharacterBond({
      worldId,
      locationId,
      characterId,
      bonded,
    });
  },
  uploadLocationImage: (locationId, image) => {
    const world = getState().worlds.currentWorld;
    const worldId = world.currentWorldId;
    const imageFilename =
      world.currentWorldLocations.locationMap[locationId]?.imageFilenames?.[0];
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }

    return uploadLocationImage({
      worldId,
      locationId,
      image,
      oldImageFilename: imageFilename,
    });
  },
  removeLocationImage: (locationId) => {
    const world = getState().worlds.currentWorld;
    const worldId = world.currentWorldId;
    const filename =
      world.currentWorldLocations.locationMap[locationId]?.imageFilenames?.[0];

    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    if (!filename) {
      return new Promise((res, reject) =>
        reject("Location did not have an image")
      );
    }
    return removeLocationImage({
      worldId,
      locationId,
      filename,
    });
  },
  subscribeToOpenLocation: (locationId) => {
    const state = getState();
    const worldId = state.worlds.currentWorld.currentWorldId;
    const isWorldOwner =
      state.worlds.currentWorld.currentWorld?.ownerIds.includes(
        state.auth.uid
      ) ?? false;

    if (!worldId) {
      return () => {};
    }
    let notesUnsubscribe = listenToLocationNotes(
      worldId,
      locationId,
      (notes) => {
        set((store) => {
          if (
            store.worlds.currentWorld.currentWorldLocations.locationMap[
              locationId
            ]
          ) {
            store.worlds.currentWorld.currentWorldLocations.locationMap[
              locationId
            ].notes = notes ?? null;
          }
        });
      },
      (error) => {
        console.error(error);
        reportApiError(error);
      }
    );

    let gmPropertiesUnsubscribe: Unsubscribe;
    if (isWorldOwner) {
      gmPropertiesUnsubscribe = listenToLocationGMProperties(
        worldId,
        locationId,
        (properties) => {
          set((store) => {
            if (
              store.worlds.currentWorld.currentWorldLocations.locationMap[
                locationId
              ]
            ) {
              store.worlds.currentWorld.currentWorldLocations.locationMap[
                locationId
              ].gmProperties = properties ?? null;
            }
          });
        },
        (error) => {
          console.error(error);
          reportApiError(error);
        }
      );
    } else {
      set((store) => {
        if (
          store.worlds.currentWorld.currentWorldLocations.locationMap[
            locationId
          ]
        ) {
          store.worlds.currentWorld.currentWorldLocations.locationMap[
            locationId
          ].gmProperties = null;
        }
      });
    }

    return () => {
      notesUnsubscribe();
      gmPropertiesUnsubscribe && gmPropertiesUnsubscribe();
    };
  },
  resetStore: () => {
    set((store) => {
      store.worlds.currentWorld.currentWorldLocations = {
        ...store.worlds.currentWorld.currentWorldLocations,
        ...defaultLocationsSlice,
      };
    });
  },
});
