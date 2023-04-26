import produce from "immer";
import { GMLocationDocument, LocationDocument } from "types/Locations.type";
import { StoreApi } from "zustand";

export type LocationDocumentWithGMProperties = LocationDocument & {
  gmProperties?: GMLocationDocument;
  notes?: Uint8Array | null;
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
  removeLocation: (locationId: string) => void;
  clearLocations: () => void;
  openLocationId?: string;
  setOpenLocationId: (locationId?: string) => void;
}

export const initialLocationState = {
  locations: {},
  openLocationId: undefined,
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
});
