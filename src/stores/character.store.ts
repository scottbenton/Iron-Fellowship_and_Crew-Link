import { getCharacterPortraitUrl } from "api/characters/getCharacterPortraitUrl";
import { firebaseAuth } from "config/firebase.config";
import { getDownloadURL } from "firebase/storage";
import produce from "immer";
import { create } from "zustand";
import { CharacterDocument } from "../types/Character.type";

export interface CharacterDocumentWithPortraitUrl extends CharacterDocument {
  portraitUrl?: string;
}

interface CharacterStore {
  characters: {
    [key: string]: CharacterDocumentWithPortraitUrl;
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
    const state = getState();
    const uid = firebaseAuth.currentUser?.uid;
    const oldUrl = state.characters[characterId].portraitUrl;
    const oldFilename = state.characters[characterId].profileImage?.filename;
    const newFilename = character.profileImage?.filename;
    if (uid && newFilename && (!oldUrl || oldFilename !== newFilename)) {
      getCharacterPortraitUrl({ uid, characterId, filename: newFilename })
        .then((url) => {
          set(
            produce((state: CharacterStore) => {
              state.characters[characterId].portraitUrl = url;
            })
          );
        })
        .catch(() => {});
    }
  },

  removeCharacter: (characterId) => {
    set(
      produce((state: CharacterStore) => {
        delete state.characters[characterId];
      })
    );
  },
}));
