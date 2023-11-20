import { CreateSliceType } from "stores/store.type";
import { LoreSlice } from "./lore.slice.type";
import { defaultLoreSlice } from "./lore.slice.default";
import { listenToLoreDocuments } from "api-calls/world/lore/listenToLoreDocuments";
import { createLore } from "api-calls/world/lore/createLore";
import { deleteLore } from "api-calls/world/lore/deleteLore";
import { updateLore } from "api-calls/world/lore/updateLore";
import { updateLoreGMNotes } from "api-calls/world/lore/updateLoreGMNotes";
import { updateLoreGMProperties } from "api-calls/world/lore/updateLoreGMProperties";
import { updateLoreNotes } from "api-calls/world/lore/updateLoreNotes";
import { uploadLoreImage } from "api-calls/world/lore/uploadLoreImage";
import { listenToLoreNotes } from "api-calls/world/lore/listenToLoreNotes";
import { reportApiError } from "lib/analytics.lib";
import { Unsubscribe } from "firebase/firestore";
import { listenToLoreGMProperties } from "api-calls/world/lore/listenToLoreGMProperties";
import { removeLoreImage } from "api-calls/world/lore/removeLoreImage";

export const createLoreSlice: CreateSliceType<LoreSlice> = (set, getState) => ({
  ...defaultLoreSlice,
  subscribe: (currentWorldId: string, currentWorldOwnerIds: string[]) => {
    const uid = getState().auth.uid;
    const isWorldOwner = currentWorldOwnerIds.includes(uid);

    return listenToLoreDocuments(
      currentWorldId,
      isWorldOwner,
      (loreId, lore) => {
        set((store) => {
          if (
            Array.isArray(lore.imageFilenames) &&
            lore.imageFilenames?.length > 0
          ) {
            store.worlds.currentWorld.doAnyDocsHaveImages = true;
          }
          const existingLore =
            store.worlds.currentWorld.currentWorldLore.loreMap[loreId];
          const gmProperties = existingLore?.gmProperties;
          const notes = existingLore?.notes;
          const imageUrl =
            (lore.imageFilenames?.length ?? 0) > 0
              ? existingLore?.imageUrl
              : undefined;
          store.worlds.currentWorld.currentWorldLore.loreMap[loreId] = {
            ...lore,
            gmProperties,
            notes,
            imageUrl,
          };
        });
      },
      (loreId, imageUrl) => {
        set((store) => {
          store.worlds.currentWorld.currentWorldLore.loreMap[loreId].imageUrl =
            imageUrl;
        });
      },
      (loreId) => {
        set((store) => {
          delete store.worlds.currentWorld.currentWorldLore.loreMap[loreId];
        });
      },
      (error) => {
        set((store) => {
          store.worlds.currentWorld.currentWorldLore.error = error;
        });
      }
    );
  },
  setOpenLoreId: (loreId) => {
    set((store) => {
      store.worlds.currentWorld.currentWorldLore.openLoreId = loreId;
    });
  },
  setLoreSearch: (search) => {
    set((store) => {
      store.worlds.currentWorld.currentWorldLore.loreSearch = search;
    });
  },

  createLore: () => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return createLore({ worldId });
  },
  deleteLore: (loreId) => {
    const world = getState().worlds.currentWorld;
    const worldId = world.currentWorldId;
    const imageFilename =
      world.currentWorldLore.loreMap[loreId]?.imageFilenames?.[0];

    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return deleteLore({ worldId, loreId, imageFilename });
  },
  updateLore: (loreId, partialLore) => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return updateLore({ worldId, loreId, lore: partialLore });
  },
  updateLoreGMNotes: (loreId, notes, isBeacon) => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return updateLoreGMNotes({ worldId, loreId, notes, isBeacon });
  },
  updateLoreGMProperties: (loreId, loreGMProperties) => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return updateLoreGMProperties({
      worldId,
      loreId,
      loreGMProperties,
    });
  },
  updateLoreNotes: (loreId, notes, isBeacon) => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return updateLoreNotes({ worldId, loreId, notes, isBeacon });
  },
  uploadLoreImage: (loreId, image) => {
    const world = getState().worlds.currentWorld;
    const worldId = world.currentWorldId;
    const imageFilename =
      world.currentWorldLore.loreMap[loreId]?.imageFilenames?.[0];

    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return uploadLoreImage({
      worldId,
      loreId,
      image,
      oldImageFilename: imageFilename,
    });
  },
  removeLoreImage: (loreId) => {
    const world = getState().worlds.currentWorld;
    const worldId = world.currentWorldId;
    const filename =
      world.currentWorldLore.loreMap[loreId]?.imageFilenames?.[0];

    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    if (!filename) {
      return new Promise((res, reject) => reject("Lore did not have an image"));
    }
    return removeLoreImage({
      worldId,
      loreId,
      filename,
    });
  },
  subscribeToOpenLore: (loreId) => {
    const state = getState();
    const worldId = state.worlds.currentWorld.currentWorldId;
    const isWorldOwner =
      state.worlds.currentWorld.currentWorld?.ownerIds.includes(
        state.auth.uid
      ) ?? false;

    if (!worldId) {
      return () => {};
    }
    const notesUnsubscribe = listenToLoreNotes(
      worldId,
      loreId,
      (notes) => {
        set((store) => {
          if (store.worlds.currentWorld.currentWorldLore.loreMap[loreId]) {
            store.worlds.currentWorld.currentWorldLore.loreMap[loreId].notes =
              notes ?? null;
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
      gmPropertiesUnsubscribe = listenToLoreGMProperties(
        worldId,
        loreId,
        (properties) => {
          set((store) => {
            if (store.worlds.currentWorld.currentWorldLore.loreMap[loreId]) {
              store.worlds.currentWorld.currentWorldLore.loreMap[
                loreId
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
        if (store.worlds.currentWorld.currentWorldLore.loreMap[loreId]) {
          store.worlds.currentWorld.currentWorldLore.loreMap[
            loreId
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
      store.worlds.currentWorld.currentWorldLore = {
        ...store.worlds.currentWorld.currentWorldLore,
        ...defaultLoreSlice,
      };
    });
  },
});
