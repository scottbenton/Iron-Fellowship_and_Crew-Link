import { Unsubscribe } from "firebase/firestore";
import { StoredCampaign } from "types/Campaign.type";
import { CurrentCampaignSlice } from "./currentCampaign/currentCampaign.slice.type";

export interface CampaignSliceData {
  campaignMap: { [campaignId: string]: StoredCampaign };
  error?: string;
  loading: boolean;
}

export interface CampaignSliceActions {
  subscribe: (uid?: string) => Unsubscribe | undefined;

  createCampaign: (campaignName: string) => Promise<string>;
  getCampaign: (campaignId: string) => Promise<StoredCampaign>;
  addUserToCampaign: (uid: string, campaignId: string) => Promise<void>;
}

export type CampaignSlice = CampaignSliceData &
  CampaignSliceActions & {
    currentCampaign: CurrentCampaignSlice;
  };
