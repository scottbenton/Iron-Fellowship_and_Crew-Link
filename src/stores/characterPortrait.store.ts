import produce from "immer";
import { create } from "zustand";

interface CharacterPortraitStore {
  portraitUrls: { [characterId: string]: string };
  setPortraitUrl: (characterId: string, portraitUrl?: string) => void;
}

export const useCharacterPortraitStore = create<CharacterPortraitStore>()(
  (set, getState) => ({
    portraitUrls: {},
    setPortraitUrl: (characterId, portraitUrl) => {
      set(
        produce((store: CharacterPortraitStore) => {
          if (portraitUrl) {
            store.portraitUrls[characterId] = portraitUrl;
          } else {
            delete store.portraitUrls[characterId];
          }
        })
      );
    },
  })
);
