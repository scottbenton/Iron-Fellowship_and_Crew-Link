import produce from "immer";
import { OracleSettings } from "types/UserSettings.type";
import { create } from "zustand";

export interface SettingsStore {
  oracleSettings?: OracleSettings;
  setOracleSettings: (oracleSettings?: OracleSettings) => void;
}

export const useSettingsStore = create<SettingsStore>()((set, getState) => ({
  setOracleSettings: (oracleSettings) => {
    set(
      produce((store: SettingsStore) => {
        store.oracleSettings = oracleSettings;
      })
    );
  },
}));
