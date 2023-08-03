import { CreateSliceType } from "stores/store.type";
import { CampaignSlice } from "./campaign.slice.type";
import { defaultCampaignSlice } from "./campaign.slice.default";
import { listenToUsersCampaigns } from "api-calls/campaign/listenToUsersCampaigns";
import { getErrorMessage } from "functions/getErrorMessage";
import { createCampaign } from "api-calls/campaign/createCampaign";

export const createCampaignSlice: CreateSliceType<CampaignSlice> = (
  set,
  getState
) => ({
  ...defaultCampaignSlice,

  subscribe: (uid) => {
    if (uid) {
      return listenToUsersCampaigns(
        uid,
        {
          onDocChange: (campaignId, campaignDocument) => {
            set((store) => {
              store.campaigns.campaignMap[campaignId] = campaignDocument;
            });
          },
          onDocRemove: (campaignId) => {
            set((store) => {
              delete store.campaigns.campaignMap[campaignId];
            });
          },
          onLoaded: () => {
            set((store) => {
              store.campaigns.loading = false;
            });
          },
        },
        (error) => {
          set((store) => {
            const errorMessage = getErrorMessage(
              error,
              "Failed to load your campaigns."
            );
            store.campaigns.error = errorMessage;
            store.campaigns.loading = false;
          });
        }
      );
    }
  },

  createCampaign: (campaignName) => {
    const uid = getState().auth.uid;

    return createCampaign({ uid, campaignName });
  },
});
