import { CreateSliceType } from "stores/store.type";
import { AssetSlice } from "./assets.slice.type";
import { defaultAssetsSlice } from "./assets.slice.default";
import { listenToAssets } from "api-calls/assets/listenToAssets";
import { addAsset } from "api-calls/assets/addAsset";
import { removeAsset } from "api-calls/assets/removeAsset";
import { updateAssetCheckbox } from "api-calls/assets/updateAssetCheckbox";
import { updateCustomAsset } from "api-calls/assets/updateCustomAsset";
import { updateAsset } from "api-calls/assets/updateAsset";
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
  updateAssetInput: (assetId, inputLabel, inputKey, inputValue) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    const dataswornAssetId =
      getState().characters.currentCharacter.assets.assets[assetId]?.id;
    if (!characterId || !dataswornAssetId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
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
      characterId,
      assetId,
      asset: { [`inputs.${inputLabel}`]: inputValue, [newKey]: inputValue },
    });
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
    const storedAssetId =
      getState().characters.currentCharacter.assets.assets[assetId]?.id;
    if (!characterId || !storedAssetId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
    }

    const dataswornAssetId = getOldDataswornId(storedAssetId);
    const oldAsset = assetMap[dataswornAssetId];

    if (oldAsset && oldAsset["Condition meter"]) {
      const key = getNewConditionMeterKey(oldAsset["Condition meter"]);
      return updateAsset({
        characterId,
        assetId,
        asset: {
          trackValue,
          [`controlValues.${key}`]: trackValue,
        },
      });
    }

    return updateAsset({
      characterId,
      assetId,
      asset: {
        trackValue,
      },
    });
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
    return updateAsset({
      characterId,
      assetId,
      asset: {
        [`conditions.${condition}`]: checked,
        [`controlValues.${condition}`]: checked,
      },
    });
  },

  updateAssetOption: (assetId, optionKey, value) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;

    const storedAssetId =
      getState().characters.currentCharacter.assets.assets[assetId]?.id;
    if (!characterId || !storedAssetId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
    }

    const dataswornAssetId = getOldDataswornId(storedAssetId);
    const convertedKey = getOldInputKey(optionKey);
    const oldId =
      assetMap[dataswornAssetId]?.Inputs?.[convertedKey].$id ?? convertedKey;
    const oldKey = `inputs.${encodeDataswornId(oldId)}`;

    return updateAsset({
      characterId,
      assetId,
      asset: { [`optionValues.${optionKey}`]: value, [oldKey]: value },
    });
  },
  updateAssetControl: (assetId, controlKey, value) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    if (!characterId) {
      return new Promise((res, reject) => reject("Character ID not defined"));
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
      characterId,
      assetId,
      asset: { [`controlValues.${controlKey}`]: value, [oldKey]: value },
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
