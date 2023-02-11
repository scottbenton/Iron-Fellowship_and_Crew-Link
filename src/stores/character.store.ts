import produce from "immer";
import create from "zustand";
import { CharacterDocument } from "../types/Character.type";

interface CharacterStore {
  characters: {
    [key: string]: CharacterDocument;
  };
  error?: string;
  loading: boolean;

  setCharacter: (characterId: string, character: CharacterDocument) => void;
  setLoading: (loading: boolean) => void;
  removeCharacter: (characterId: string) => void;
}

export const useCharacterStore = create<CharacterStore>()((set, getState) => ({
  characters: {},
  error: undefined,
  loading: true,

  setLoading: (loading) => {
    set(
      produce((state: CharacterStore) => {
        state.loading = loading;
      })
    );
  },

  setCharacter: (characterId, character) => {
    set(
      produce((state: CharacterStore) => {
        state.characters[characterId] = character;
        state.loading = false;
      })
    );
  },

  removeCharacter: (characterId) => {
    set(
      produce((state: CharacterStore) => {
        delete state.characters[characterId];
      })
    );
  },
}));
