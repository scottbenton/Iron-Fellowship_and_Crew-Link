import { CreateSliceType } from "stores/store.type";
import { SharedAssetSlice } from "./sharedAssets.slice.type";
import { defaultSharedAssetsSlice } from "./sharedAssets.slice.default";
import { listenToAssets } from "api-calls/assets/listenToAssets";
import { addAsset } from "api-calls/assets/addAsset";
import { removeAsset } from "api-calls/assets/removeAsset";
import { updateAssetCheckbox } from "api-calls/assets/updateAssetCheckbox";
import { updateCustomAsset } from "api-calls/assets/updateCustomAsset";
import {
  assetMap,
  getNewConditionMeterKey,
  getNewControlKey,
  getNewDataswornId,
  getNewInputKey,
  getOldDataswornId,
  getOldInputKey,
} from "data/assets";
import { encodeDataswornId } from "functions/dataswornIdEncoder";
import { updateAsset } from "api-calls/assets/updateAsset";

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

    const dataswornAssetId =
      getState().campaigns.currentCampaign.assets.assets[assetId]?.id;

    if (!campaignId || !dataswornAssetId) {
      return new Promise((res, reject) => reject("Campaign ID not defined"));
    }
    const newAssetId = getNewDataswornId(dataswornAssetId);

    let newKey: string;
    const newInputKey = getNewInputKey(newAssetId, inputKey);
    if (!newInputKey) {
      const newControlKey = getNewControlKey(inputKey);
      newKey = `controlValues.${newControlKey}`;
    } else {
      newKey = `optionValues.${newInputKey}`;
    }

    return updateAsset({
      campaignId,
      assetId,
      asset: { [`inputs.${inputLabel}`]: inputValue, [newKey]: inputValue },
    });
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
    const storedAssetId =
      getState().campaigns.currentCampaign.assets.assets[assetId]?.id;
    console.debug(storedAssetId);
    if (!campaignId || !storedAssetId) {
      return new Promise((res, reject) => reject("Campaign ID not defined"));
    }

    const dataswornAssetId = getOldDataswornId(storedAssetId);
    const oldAsset = assetMap[dataswornAssetId];

    if (oldAsset && oldAsset["Condition meter"]) {
      const key = getNewConditionMeterKey(oldAsset["Condition meter"]);
      return updateAsset({
        campaignId,
        assetId,
        asset: {
          trackValue,
          [`controlValues.${key}`]: trackValue,
        },
      });
    }

    return updateAsset({
      campaignId,
      assetId,
      asset: {
        trackValue,
      },
    });
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
    return updateAsset({
      campaignId,
      assetId,
      asset: {
        [`conditions.${condition}`]: checked,
        [`controlValues.${condition}`]: checked,
      },
    });
  },

  updateAssetOption: (assetId, optionKey, value) => {
    const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
    const storedAssetId =
      getState().campaigns.currentCampaign.assets.assets[assetId]?.id;
    if (!campaignId || !storedAssetId) {
      return new Promise((res, reject) => reject("Campaign ID not defined"));
    }

    const dataswornAssetId = getOldDataswornId(storedAssetId);
    const convertedKey = getOldInputKey(optionKey);
    const oldId =
      assetMap[dataswornAssetId]?.Inputs?.[convertedKey].$id ?? convertedKey;
    const oldKey = `inputs.${encodeDataswornId(oldId)}`;

    return updateAsset({
      campaignId,
      assetId,
      asset: { [`optionValues.${optionKey}`]: value, [oldKey]: value },
    });
  },
  updateAssetControl: (assetId, controlKey, value) => {
    const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
    console.debug(assetId, controlKey, value, campaignId);
    if (!campaignId) {
      return new Promise((res, reject) => reject("Campaign ID not defined"));
    }

    let oldKey: string;

    // Asset condition
    if (typeof value === "boolean") {
      oldKey = `conditions.${controlKey}`;
    }
    // Track value
    else if (typeof value === "number") {
      oldKey = "trackValue";
    } else {
      const dataswornAssetId = getOldDataswornId(assetId);
      const convertedKey = getOldInputKey(controlKey);
      const oldId =
        assetMap[dataswornAssetId]?.Inputs?.[convertedKey].$id ?? convertedKey;
      oldKey = `inputs.${encodeDataswornId(oldId)}`;
    }

    return updateAsset({
      campaignId,
      assetId,
      asset: { [`controlValues.${controlKey}`]: value, [oldKey]: value },
    });
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
