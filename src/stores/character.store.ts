import { Unsubscribe } from "firebase/firestore";
import create from "zustand";
import { getUsersCharacters as getCurrentUsersCharacters } from "../api/getUsersCharacters";
import { CharacterDocument } from "../types/Character.type";

interface CharacterStore {
  characters: {
    [key: string]: CharacterDocument;
  };
  error?: string;
  loading: boolean;

  getUsersCharacters: () => Unsubscribe | null;
}

export const useCharacterStore = create<CharacterStore>()((set, getState) => ({
  characters: {},
  error: undefined,
  loading: true,

  getUsersCharacters: () => {
    return getCurrentUsersCharacters(
      (characters) => set({ characters, loading: false }),
      (error) => set({ error, loading: false })
    );
  },
}));
