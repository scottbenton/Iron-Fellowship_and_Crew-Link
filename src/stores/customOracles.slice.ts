import produce from "immer";
import { StoredOracle } from "types/Oracles.type";
import { StoreApi } from "zustand";

export interface CustomOraclesStoreProperties {
  customOracles: {
    [uid: string]: StoredOracle[];
  };
  setCustomOracles: (uid: string, oracles: StoredOracle[]) => void;
}

export const initialCustomOraclesState = {
  customOracles: {},
};

export const customOraclesStore = (
  set: StoreApi<CustomOraclesStoreProperties>["setState"]
) => ({
  setCustomOracles: (uid: string, oracles: StoredOracle[]) => {
    set(
      produce((state: CustomOraclesStoreProperties) => {
        state.customOracles[uid] = oracles;
      })
    );
  },
});
