import { CreateSliceType } from "stores/store.type";
import { NPCsSlice } from "./npcs.slice.type";
import { defaultNPCsSlice } from "./npcs.slice.default";
import { listenToNPCs } from "api-calls/world/npcs/listenToNPCs";
import { createNPC } from "api-calls/world/npcs/createNPC";
import { deleteNPC } from "api-calls/world/npcs/deleteNPC";
import { updateNPC } from "api-calls/world/npcs/updateNPC";
import { updateNPCGMNotes } from "api-calls/world/npcs/updateNPCGMNotes";
import { updateNPCGMProperties } from "api-calls/world/npcs/updateNPCGMProperties";
import { updateNPCNotes } from "api-calls/world/npcs/updateNPCNotes";
import { uploadNPCImage } from "api-calls/world/npcs/uploadNPCImage";
import { listenToNPCNotes } from "api-calls/world/npcs/listenToNPCNotes";
import { reportApiError } from "lib/analytics.lib";
import { Unsubscribe } from "firebase/firestore";
import { listenToNPCGMProperties } from "api-calls/world/npcs/listenToNPCGMProperties";
import { updateNPCCharacterBond } from "api-calls/world/npcs/updateNPCCharacterBond";
import { updateNPCCharacterConnection } from "api-calls/world/npcs/updateNPCCharacterConnection";
import { updateNPCCharacterBondProgress } from "api-calls/world/npcs/updateNPCCharacterBond copy";
import { removeNPCImage } from "api-calls/world/npcs/removeNPCImage";

export const createNPCsSlice: CreateSliceType<NPCsSlice> = (set, getState) => ({
  ...defaultNPCsSlice,
  subscribe: (currentWorldId: string, currentWorldOwnerIds: string[]) => {
    const uid = getState().auth.uid;
    const isWorldOwner = currentWorldOwnerIds.includes(uid);

    return listenToNPCs(
      currentWorldId,
      isWorldOwner,
      (npcId, npc) => {
        set((store) => {
          if (
            Array.isArray(npc.imageFilenames) &&
            npc.imageFilenames?.length > 0
          ) {
            store.worlds.currentWorld.doAnyDocsHaveImages = true;
          }
          const existingNPC =
            store.worlds.currentWorld.currentWorldNPCs.npcMap[npcId];
          const gmProperties = existingNPC?.gmProperties;
          const notes = existingNPC?.notes;
          const imageUrl =
            (npc.imageFilenames?.length ?? 0) > 0
              ? existingNPC?.imageUrl
              : undefined;
          store.worlds.currentWorld.currentWorldNPCs.npcMap[npcId] = {
            ...npc,
            gmProperties,
            notes,
            imageUrl,
          };
        });
      },
      (npcId, imageUrl) => {
        set((store) => {
          if (store.worlds.currentWorld.currentWorldNPCs.npcMap[npcId]) {
            store.worlds.currentWorld.currentWorldNPCs.npcMap[npcId].imageUrl =
              imageUrl;
          }
        });
      },
      (npcId) => {
        set((store) => {
          delete store.worlds.currentWorld.currentWorldNPCs.npcMap[npcId];
        });
      },
      (error) => {
        set((store) => {
          store.worlds.currentWorld.currentWorldNPCs.error = error;
        });
      }
    );
  },
  setOpenNPCId: (npcId) => {
    set((store) => {
      store.worlds.currentWorld.currentWorldNPCs.openNPCId = npcId;
    });
  },
  setNPCSearch: (search) => {
    set((store) => {
      store.worlds.currentWorld.currentWorldNPCs.npcSearch = search;
    });
  },

  createNPC: (npc) => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return createNPC({ worldId, npc });
  },
  deleteNPC: (npcId) => {
    const currentWorld = getState().worlds.currentWorld;
    const worldId = currentWorld.currentWorldId;
    const npcImageFilename =
      currentWorld.currentWorldNPCs.npcMap[npcId]?.imageFilenames?.[0];

    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return deleteNPC({ worldId, npcId, imageFilename: npcImageFilename });
  },
  updateNPC: (npcId, partialNPC) => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return updateNPC({ worldId, npcId, npc: partialNPC });
  },
  updateNPCGMNotes: (npcId, notes, isBeacon) => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return updateNPCGMNotes({ worldId, npcId, notes, isBeacon });
  },
  updateNPCGMProperties: (npcId, npcGMProperties) => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return updateNPCGMProperties({
      worldId,
      npcId,
      npcGMProperties,
    });
  },
  updateNPCNotes: (npcId, notes, isBeacon) => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return updateNPCNotes({ worldId, npcId, notes, isBeacon });
  },
  updateNPCCharacterBond: (npcId, characterId, bonded) => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return updateNPCCharacterBond({
      worldId,
      npcId,
      characterId,
      bonded,
    });
  },
  updateNPCCharacterConnection: (npcId, characterId, isConnection) => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return updateNPCCharacterConnection({
      worldId,
      npcId,
      characterId,
      isConnection,
    });
  },

  updateNPCCharacterBondValue: (npcId, characterId, progress) => {
    const worldId = getState().worlds.currentWorld.currentWorldId;
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return updateNPCCharacterBondProgress({
      worldId,
      npcId,
      characterId,
      progress,
    });
  },
  uploadNPCImage: (npcId, image) => {
    const currentWorld = getState().worlds.currentWorld;
    const worldId = currentWorld.currentWorldId;
    const oldNPCImageFilename =
      currentWorld.currentWorldNPCs.npcMap[npcId]?.imageFilenames?.[0];
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    return uploadNPCImage({
      worldId,
      npcId,
      image,
      oldImageFilename: oldNPCImageFilename,
    });
  },
  removeNPCImage: (npcId) => {
    const currentWorld = getState().worlds.currentWorld;
    const worldId = currentWorld.currentWorldId;
    const filename =
      currentWorld.currentWorldNPCs.npcMap[npcId]?.imageFilenames?.[0];
    if (!worldId) {
      return new Promise((res, reject) => reject("No world found"));
    }
    if (!filename) {
      return new Promise((res, reject) => reject("No image found to remove"));
    }
    return removeNPCImage({
      worldId,
      npcId,
      filename,
    });
  },
  subscribeToOpenNPC: (npcId) => {
    const state = getState();
    const worldId = state.worlds.currentWorld.currentWorldId;
    const isWorldOwner =
      state.worlds.currentWorld.currentWorld?.ownerIds.includes(
        state.auth.uid
      ) ?? false;

    if (!worldId) {
      return () => {};
    }
    const notesUnsubscribe = listenToNPCNotes(
      worldId,
      npcId,
      (notes) => {
        set((store) => {
          if (store.worlds.currentWorld.currentWorldNPCs.npcMap[npcId]) {
            store.worlds.currentWorld.currentWorldNPCs.npcMap[npcId].notes =
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
      gmPropertiesUnsubscribe = listenToNPCGMProperties(
        worldId,
        npcId,
        (properties) => {
          set((store) => {
            if (store.worlds.currentWorld.currentWorldNPCs.npcMap[npcId]) {
              store.worlds.currentWorld.currentWorldNPCs.npcMap[
                npcId
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
        if (store.worlds.currentWorld.currentWorldNPCs.npcMap[npcId]) {
          store.worlds.currentWorld.currentWorldNPCs.npcMap[
            npcId
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
      store.worlds.currentWorld.currentWorldNPCs = {
        ...store.worlds.currentWorld.currentWorldNPCs,
        ...defaultNPCsSlice,
      };
    });
  },
});
