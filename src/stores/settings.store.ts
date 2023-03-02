import create from "zustand";
import produce from "immer";
import { Settings } from "types/Settings.type";

interface SettingsStore {
  campaigns: {
    [key: string]: Settings;
  };

  error?: string;
  loading: boolean;

  setSettings: (campaignId: string, settings: Settings) => void;
  removeSettings: (campaignId: string) => void;
  setError: (error?: string) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()((set, getState) => ({
  campaigns: {},
  error: undefined,
  loading: true,

  setSettings: (campaignId: string, settings: Settings) => {
    set(
      produce((state: SettingsStore) => {
        state.campaigns[campaignId] = settings;
        state.loading = false;
      })
    );
  },
  removeSettings: (campaignId: string) => {
    set(
      produce((state: SettingsStore) => {
        delete state.campaigns[campaignId];
      })
    );
  },

  setError: (error?: string) => {
    set(
      produce((state: SettingsStore) => {
        state.error = error;
      })
    );
  },
  setLoading: (isLoading: boolean) => {
    set(
      produce((state: SettingsStore) => {
        state.loading = isLoading ?? false;
      })
    );
  },
}));
