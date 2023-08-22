import { CreateSliceType } from "stores/store.type";
import { CurrentCharacterSlice } from "./currentCharacter.slice.type";
import { defaultCurrentCharacterSlice } from "./currentCharacter.slice.default";
import { updateCharacter } from "api-calls/character/updateCharacter";
import { createAssetsSlice } from "./assets/assets.slice";
import { createCharacterTracksSlice } from "./tracks/characterTracks.slice";
import { updateCharacterPortrait } from "api-calls/character/updateCharacterPortrait";

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
        portrait,
        scale,
        position,
      });
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
