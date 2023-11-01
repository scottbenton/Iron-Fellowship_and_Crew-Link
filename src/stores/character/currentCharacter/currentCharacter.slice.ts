import { CreateSliceType } from "stores/store.type";
import { CurrentCharacterSlice } from "./currentCharacter.slice.type";
import { defaultCurrentCharacterSlice } from "./currentCharacter.slice.default";
import { updateCharacter } from "api-calls/character/updateCharacter";
import { createAssetsSlice } from "./assets/assets.slice";
import { createCharacterTracksSlice } from "./tracks/characterTracks.slice";
import { updateCharacterPortrait } from "api-calls/character/updateCharacterPortrait";
import { removeCharacterPortrait } from "api-calls/character/removeCharacterPortrait";

export const createCurrentCharacterSlice: CreateSliceType<
  CurrentCharacterSlice
> = (...params) => {
  const [set, getState] = params;
  return {
    ...defaultCurrentCharacterSlice,

    assets: createAssetsSlice(...params),
    tracks: createCharacterTracksSlice(...params),

    setCurrentCharacterId: (characterId) => {
      set((store) => {
        store.characters.currentCharacter.currentCharacterId = characterId;

        store.characters.currentCharacter.currentCharacter = characterId
          ? store.characters.characterMap[characterId]
          : undefined;
      });
    },

    updateCurrentCharacter: (character) => {
      const characterId =
        getState().characters.currentCharacter.currentCharacterId;
      if (!characterId) {
        return new Promise((res, reject) =>
          reject("Character ID must be defined")
        );
      }

      return updateCharacter({ characterId, character });
    },

    updateCurrentCharacterPortrait: (portrait, scale, position) => {
      const state = getState();
      const uid = state.auth.user?.uid;
      const characterId = state.characters.currentCharacter.currentCharacterId;

      if (!uid || !characterId) {
        return new Promise((res, reject) =>
          reject("Character ID or UserID were not defined")
        );
      }
      return updateCharacterPortrait({
        uid,
        characterId,
        oldPortraitFilename:
          state.characters.currentCharacter.currentCharacter?.profileImage
            ?.filename,
        portrait,
        scale,
        position,
      });
    },
    removeCurrentCharacterPortrait: () => {
      const state = getState();
      const uid = state.auth.user?.uid;
      const characterId = state.characters.currentCharacter.currentCharacterId;
      const oldPortraitFilename =
        state.characters.currentCharacter.currentCharacter?.profileImage
          ?.filename;
      if (!uid || !characterId) {
        return new Promise((res, reject) =>
          reject("Character ID or UserID were not defined")
        );
      }
      if (!oldPortraitFilename) {
        return new Promise((res, reject) => {
          reject("We could not find your old portrait");
        });
      }

      return removeCharacterPortrait({ uid, characterId, oldPortraitFilename });
    },

    resetStore: () => {
      set((store) => {
        store.characters.currentCharacter = {
          ...store.characters.currentCharacter,
          ...defaultCurrentCharacterSlice,
        };
      });

      const state = getState();
      state.characters.currentCharacter.assets.resetStore();
      state.characters.currentCharacter.tracks.resetStore();
      state.notes.resetStore();
      state.gameLog.resetStore();
    },
  };
};
