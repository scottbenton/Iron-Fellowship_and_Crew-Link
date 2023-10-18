import { CreateSliceType } from "stores/store.type";
import { AssetSlice } from "./assets.slice.type";
import { defaultAssetsSlice } from "./assets.slice.default";
import { listenToAssets } from "api-calls/assets/listenToAssets";
import { addAsset } from "api-calls/assets/addAsset";
import { removeAsset } from "api-calls/assets/removeAsset";
import { updateAssetInput } from "api-calls/assets/updateAssetInput";
import { updateAssetCheckbox } from "api-calls/assets/updateAssetCheckbox";
import { updateAssetTrack } from "api-calls/assets/updateAssetTrack";
import { updateCustomAsset } from "api-calls/assets/updateCustomAsset";
import { updateAssetCondition } from "api-calls/assets/updateAssetCondition";

export const createAssetsSlice: CreateSliceType<AssetSlice> = (
  set,
  getState
) => ({
  ...defaultAssetsSlice,

  subscribe: (characterId) => {
    set((store) => {
      store.characters.currentCharacter.assets.loading = true;
    });
    return listenToAssets(
      characterId,
      undefined,
      (assets) => {
        set((store) => {
          store.characters.currentCharacter.assets.assets = assets;
          store.characters.currentCharacter.assets.loading = false;
        });
      },
      (error) => {
        console.error(error);
        set((store) => {
          store.characters.currentCharacter.assets.loading = false;
          store.characters.currentCharacter.assets.error = error;
        });
      }
    );
  },

  addAsset: (asset) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    if (!characterId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
    }
    return addAsset({ asset, characterId });
  },
  removeAsset: (assetId) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    if (!characterId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
    }
    return removeAsset({ characterId, assetId });
  },
  updateAssetInput: (assetId, inputLabel, inputValue) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    if (!characterId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
    }
    return updateAssetInput({ characterId, assetId, inputLabel, inputValue });
  },
  updateAssetCheckbox: (assetId, abilityIndex, checked) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    if (!characterId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
    }

    return updateAssetCheckbox({ characterId, assetId, abilityIndex, checked });
  },
  updateAssetTrack: (assetId, trackValue) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    if (!characterId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
    }
    return updateAssetTrack({ characterId, assetId, value: trackValue });
  },
  updateCustomAsset: (assetId, asset) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    if (!characterId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
    }
    return updateCustomAsset({ characterId, assetId, asset });
  },
  updateAssetCondition: (assetId, condition, checked) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    if (!characterId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
    }
    return updateAssetCondition({ characterId, assetId, condition, checked });
  },

  resetStore: () => {
    set((store) => {
      store.characters.currentCharacter.assets = {
        ...store.characters.currentCharacter.assets,
        ...defaultAssetsSlice,
      };
    });
  },
});
