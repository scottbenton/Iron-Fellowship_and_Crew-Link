import { create } from "zustand";
import produce from "immer";
import { OracleSettings } from "types/UserSettings.type";

interface SettingsStore {
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
