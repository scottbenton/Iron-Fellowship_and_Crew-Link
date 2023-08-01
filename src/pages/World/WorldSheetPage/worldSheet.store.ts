import {
  WorldStoreProperties,
  initialWorldState,
  worldStore,
} from "stores/world.slice";
import { create } from "zustand";

export type WorldSheetStore = {
  resetState: () => void;
} & WorldStoreProperties;

const initialState = {
  ...initialWorldState,
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

    ...worldStore(set),
  })
);
