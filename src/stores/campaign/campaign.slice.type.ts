import { Unsubscribe } from "firebase/firestore";
import { StoredCampaign } from "types/Campaign.type";

export interface CampaignSliceData {
  campaignMap: { [campaignId: string]: StoredCampaign };
  error?: string;
  loading: boolean;
}

export interface CampaignSliceActions {
  subscribe: (uid?: string) => Unsubscribe | undefined;

  createCampaign: (campaignName: string) => Promise<string>;
}

export type CampaignSlice = CampaignSliceData & CampaignSliceActions;
