import { CreateSliceType } from "stores/store.type";
import { AssetSlice } from "./assets.slice.type";
import { defaultAssetsSlice } from "./assets.slice.default";
import { listenToAssets } from "api-calls/assets/listenToAssets";
import { addAsset } from "api-calls/assets/addAsset";
import { removeAsset } from "api-calls/assets/removeAsset";
import { updateAssetCheckbox } from "api-calls/assets/updateAssetCheckbox";
import { updateAsset } from "api-calls/assets/updateAsset";

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
        console.debug(assets);
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
  updateAssetCheckbox: (assetId, abilityIndex, checked) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    if (!characterId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
    }

    return updateAssetCheckbox({ characterId, assetId, abilityIndex, checked });
  },

  updateAssetOption: (assetId, optionKey, value) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;

    const storedAssetId =
      getState().characters.currentCharacter.assets.assets[assetId]?.id;
    if (!characterId || !storedAssetId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
    }

    return updateAsset({
      characterId,
      assetId,
      asset: { [`optionValues.${optionKey}`]: value },
    });
  },
  updateAssetControl: (assetId, controlKey, value) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    if (!characterId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
    }

    return updateAsset({
      characterId,
      assetId,
      asset: { [`controlValues.${controlKey}`]: value },
    });
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
