import { CreateSliceType } from "stores/store.type";
import { SharedAssetSlice } from "./sharedAssets.slice.type";
import { defaultSharedAssetsSlice } from "./sharedAssets.slice.default";
import { listenToAssets } from "api-calls/assets/listenToAssets";
import { addAsset } from "api-calls/assets/addAsset";
import { removeAsset } from "api-calls/assets/removeAsset";
import { updateAssetInput } from "api-calls/assets/updateAssetInput";
import { updateAssetCheckbox } from "api-calls/assets/updateAssetCheckbox";
import { updateAssetTrack } from "api-calls/assets/updateAssetTrack";
import { updateCustomAsset } from "api-calls/assets/updateCustomAsset";
import { updateAssetCondition } from "api-calls/assets/updateAssetCondition";

export const createSharedAssetsSlice: CreateSliceType<SharedAssetSlice> = (
  set,
  getState
) => ({
  ...defaultSharedAssetsSlice,

  subscribe: (campaignId) => {
    set((store) => {
      store.campaigns.currentCampaign.assets.loading = true;
    });
    return listenToAssets(
      undefined,
      campaignId,
      (assets) => {
        set((store) => {
          store.campaigns.currentCampaign.assets.assets = assets;
          store.campaigns.currentCampaign.assets.loading = false;
        });
      },
      (error) => {
        console.error(error);
        set((store) => {
          store.campaigns.currentCampaign.assets.loading = false;
          store.campaigns.currentCampaign.assets.error = error;
        });
      }
    );
  },

  addAsset: (asset) => {
    const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
    if (!campaignId) {
      return new Promise((res, reject) => reject("Campaign ID not defined"));
    }
    return addAsset({ asset, campaignId });
  },
  removeAsset: (assetId) => {
    const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
    if (!campaignId) {
      return new Promise((res, reject) => reject("Campaign ID not defined"));
    }
    return removeAsset({ campaignId, assetId });
  },
  updateAssetInput: (assetId, inputLabel, inputKey, inputValue) => {
    const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
    if (!campaignId) {
      return new Promise((res, reject) => reject("Campaign ID not defined"));
    }
    return updateAssetInput({ campaignId, assetId, inputLabel, inputValue });
  },
  updateAssetCheckbox: (assetId, abilityIndex, checked) => {
    const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
    if (!campaignId) {
      return new Promise((res, reject) => reject("Campaign ID not defined"));
    }

    return updateAssetCheckbox({ campaignId, assetId, abilityIndex, checked });
  },
  updateAssetTrack: (assetId, trackValue) => {
    const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
    if (!campaignId) {
      return new Promise((res, reject) => reject("Campaign ID not defined"));
    }
    return updateAssetTrack({ campaignId, assetId, value: trackValue });
  },
  updateCustomAsset: (assetId, asset) => {
    const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
    if (!campaignId) {
      return new Promise((res, reject) => reject("Campaign ID not defined"));
    }
    return updateCustomAsset({ campaignId, assetId, asset });
  },
  updateAssetCondition: (assetId, condition, checked) => {
    const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
    if (!campaignId) {
      return new Promise((res, reject) => reject("Campaign ID not defined"));
    }
    return updateAssetCondition({ campaignId, assetId, condition, checked });
  },

  resetStore: () => {
    set((store) => {
      store.campaigns.currentCampaign.assets = {
        ...store.campaigns.currentCampaign.assets,
        ...defaultSharedAssetsSlice,
      };
    });
  },
});
