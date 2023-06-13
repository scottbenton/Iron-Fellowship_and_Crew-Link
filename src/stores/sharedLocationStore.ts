import produce from "immer";
import { GMLocationDocument, LocationDocument } from "types/Locations.type";
import { GMNPCDocument, NPCDocument } from "types/NPCs.type";
import { StoreApi } from "zustand";

export type LocationDocumentWithGMProperties = LocationDocument & {
  gmProperties?: GMLocationDocument;
  notes?: Uint8Array | null;
  imageUrls?: string[];
};

export type NPC = NPCDocument & {
  gmProperties?: GMNPCDocument;
  notes?: Uint8Array | null;
  imageUrls?: string[];
};

export interface LocationStoreProperties {
  locations: {
    [key: string]: LocationDocumentWithGMProperties;
  };
  updateLocation: (locationId: string, location: LocationDocument) => void;
  updateLocationGMProperties: (
    locationId: string,
    locationGMProperties: GMLocationDocument
  ) => void;
  updateLocationNotes: (locationId: string, notes: Uint8Array | null) => void;
  addLocationImageURL: (
    locationId: string,
    imageIndex: string,
    url: string
  ) => void;
  removeLocation: (locationId: string) => void;
  clearLocations: () => void;
  openLocationId?: string;
  setOpenLocationId: (locationId?: string) => void;

  npcs: {
    [key: string]: NPC;
  };
  updateNPC: (npcId: string, npc: NPCDocument) => void;
  updateNPCGMProperties: (
    npcId: string,
    npcGMProperties: GMNPCDocument
  ) => void;
  updateNPCNotes: (npcId: string, notes: Uint8Array | null) => void;
  removeNPC: (npcId: string) => void;
  clearNPCs: () => void;
  openNPCId?: string;
  setOpenNPCId: (npcId?: string) => void;
}

export const initialLocationState = {
  locations: {},
  openLocationId: undefined,

  npcs: {},
  openNPCId: undefined,
};

export const locationStore = (
  set: StoreApi<LocationStoreProperties>["setState"]
) => ({
  updateLocation: (locationId: string, location: LocationDocument) => {
    set(
      produce((state: LocationStoreProperties) => {
        const { gmProperties, notes } = state.locations[locationId] ?? {};
        state.locations[locationId] = { gmProperties, notes, ...location };
      })
    );
  },

  updateLocationGMProperties: (
    locationId: string,
    locationGMProperties: GMLocationDocument
  ) => {
    set(
      produce((state: LocationStoreProperties) => {
        state.locations[locationId].gmProperties = locationGMProperties;
      })
    );
  },

  updateLocationNotes: (locationId: string, notes: Uint8Array | null) => {
    set(
      produce((state: LocationStoreProperties) => {
        state.locations[locationId].notes = notes;
      })
    );
  },

  addLocationImageURL: (
    locationId: string,
    imageIndex: number,
    url: string
  ) => {
    set(
      produce((state: LocationStoreProperties) => {
        if (!Array.isArray(state.locations[locationId].imageUrls)) {
          state.locations[locationId].imageUrls = [];
        }
        (state.locations[locationId].imageUrls as string[])[imageIndex] = url;
      })
    );
  },

  removeLocation: (locationId: string) => {
    set(
      produce((state: LocationStoreProperties) => {
        delete state.locations[locationId];
      })
    );
  },

  clearLocations: () => {
    set(
      produce((state: LocationStoreProperties) => {
        state.locations = {};
      })
    );
  },

  setOpenLocationId: (locationId?: string) => {
    set(
      produce((state: LocationStoreProperties) => {
        state.openLocationId = locationId;
      })
    );
  },

  updateNPC: (npcId: string, npc: NPCDocument) => {
    set(
      produce((state: LocationStoreProperties) => {
        const { gmProperties, notes } = state.npcs[npcId] ?? {};
        state.npcs[npcId] = { gmProperties, notes, ...npc };
      })
    );
  },

  updateNPCGMProperties: (npcId: string, npcGMProperties: GMNPCDocument) => {
    set(
      produce((state: LocationStoreProperties) => {
        state.npcs[npcId].gmProperties = npcGMProperties;
      })
    );
  },

  updateNPCNotes: (npcId: string, notes: Uint8Array | null) => {
    set(
      produce((state: LocationStoreProperties) => {
        state.npcs[npcId].notes = notes;
      })
    );
  },

  removeNPC: (npcId: string) => {
    set(
      produce((state: LocationStoreProperties) => {
        delete state.npcs[npcId];
      })
    );
  },

  clearNPCs: () => {
    set(
      produce((state: LocationStoreProperties) => {
        state.npcs = {};
      })
    );
  },

  setOpenNPCId: (npcId?: string) => {
    set(
      produce((state: LocationStoreProperties) => {
        state.openNPCId = npcId;
      })
    );
  },
});
