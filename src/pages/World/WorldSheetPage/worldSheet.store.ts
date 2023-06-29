import {
  LocationStoreProperties,
  initialLocationState,
  locationStore,
} from "stores/sharedLocationStore";
import { create } from "zustand";

export type WorldSheetStore = {
  resetState: () => void;
} & LocationStoreProperties;

const initialState = {
  ...initialLocationState,
};

export const useWorldSheetStore = create<WorldSheetStore>()(
  (set, getState) => ({
    ...initialState,

    resetState: () => {
      set({
        ...getState(),
        ...initialState,
      });
    },

    ...locationStore(set),
  })
);
