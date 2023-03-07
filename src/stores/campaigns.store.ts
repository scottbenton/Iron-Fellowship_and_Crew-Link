import { create } from "zustand";
import { StoredCampaign } from "../types/Campaign.type";
import produce from "immer";

interface CampaignStore {
  campaigns: {
    [key: string]: StoredCampaign;
  };
  error?: string;
  loading: boolean;

  setCampaign: (campaignId: string, campaign: StoredCampaign) => void;
  removeCampaign: (campaignId: string) => void;
  setError: (error?: string) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useCampaignStore = create<CampaignStore>()((set, getState) => ({
  campaigns: {},
  error: undefined,
  loading: true,

  setCampaign: (campaignId: string, campaign: StoredCampaign) => {
    set(
      produce((state: CampaignStore) => {
        state.campaigns[campaignId] = campaign;
        state.loading = false;
      })
    );
  },
  removeCampaign: (campaignId: string) => {
    set(
      produce((state: CampaignStore) => {
        delete state.campaigns[campaignId];
      })
    );
  },

  setError: (error?: string) => {
    set(
      produce((state: CampaignStore) => {
        state.error = error;
      })
    );
  },
  setLoading: (isLoading: boolean) => {
    set(
      produce((state: CampaignStore) => {
        state.loading = isLoading ?? false;
      })
    );
  },
}));
