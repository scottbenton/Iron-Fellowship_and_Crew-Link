import produce from "immer";
import { UserDocument } from "types/User.type";
import { create } from "zustand";

interface MiscDataStore {
  portraitUrls: { [characterId: string]: string };
  setPortraitUrl: (characterId: string, portraitUrl?: string) => void;

  userDocs: { [uid: string]: UserDocument };
  setUserDoc: (uid: string, doc: UserDocument) => void;
}

export const useMiscDataStore = create<MiscDataStore>()((set, getState) => ({
  portraitUrls: {},
  setPortraitUrl: (characterId, portraitUrl) => {
    set(
      produce((store: MiscDataStore) => {
        if (portraitUrl) {
          store.portraitUrls[characterId] = portraitUrl;
        } else {
          delete store.portraitUrls[characterId];
        }
      })
    );
  },

  userDocs: {},
  setUserDoc: (uid, doc) => {
    set(
      produce((store: MiscDataStore) => {
        store.userDocs[uid] = doc;
      })
    );
  },
}));
