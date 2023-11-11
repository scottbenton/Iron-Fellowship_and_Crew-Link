import { CreateSliceType } from "stores/store.type";
import { CampaignSlice } from "./campaign.slice.type";
import { defaultCampaignSlice } from "./campaign.slice.default";
import { listenToUsersCampaigns } from "api-calls/campaign/listenToUsersCampaigns";
import { getErrorMessage } from "functions/getErrorMessage";
import { createCampaign } from "api-calls/campaign/createCampaign";
import { createCurrentCampaignSlice } from "./currentCampaign/currentCampaign.slice";
import { StoredCampaign } from "types/Campaign.type";
import { getCampaign } from "api-calls/campaign/getCampaign";
import { addUserToCampaign } from "api-calls/campaign/addUserToCampaign";

export const createCampaignSlice: CreateSliceType<CampaignSlice> = (
  ...params
) => {
  const [set, getState] = params;
  return {
    ...defaultCampaignSlice,
    currentCampaign: createCurrentCampaignSlice(...params),

    subscribe: (uid) => {
      if (uid) {
        return listenToUsersCampaigns(
          uid,
          {
            onDocChange: (campaignId, campaignDocument) => {
              set((store) => {
                store.campaigns.campaignMap[campaignId] = campaignDocument;
                store.campaigns.loading = false;
              });
              const state = getState();
              if (
                campaignId === state.campaigns.currentCampaign.currentCampaignId
              ) {
                state.campaigns.currentCampaign.setCurrentCampaign(
                  campaignDocument
                );
              }
            },
            onDocRemove: (campaignId) => {
              const state = getState();

              set((store) => {
                delete store.campaigns.campaignMap[campaignId];
                store.campaigns.loading = false;
              });
              if (
                campaignId === state.campaigns.currentCampaign.currentCampaignId
              ) {
                state.campaigns.currentCampaign.setCurrentCampaign(undefined);
              }
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
    getCampaign: (campaignId) => {
      const campaign = getState().campaigns.campaignMap[campaignId];

      if (campaign) {
        return new Promise((res) => res(campaign));
      } else {
        return getCampaign(campaignId);
      }
    },

    addUserToCampaign: (userId, campaignId) => {
      return addUserToCampaign({ userId, campaignId });
    },
  };
};
