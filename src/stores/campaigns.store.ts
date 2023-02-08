import create from "zustand";
import { StoredCampaign } from "../types/Campaign.type";
import produce from "immer";
import { firebaseAuth } from "../config/firebase.config";
import { supplyTrack } from "../data/defaultTracks";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  deleteDoc,
  deleteField,
  updateDoc,
} from "firebase/firestore";
import {
  getCampaignCollection,
  getCampaignDoc,
  getCharacterDoc,
} from "../lib/firebase.lib";

interface CampaignStore {
  campaigns: {
    [key: string]: StoredCampaign;
  };
  error?: string;
  loading: boolean;

  setCampaign: (campaignId: string, campaign: StoredCampaign) => void;
  removeCampaign: (campaignId: string) => void;
  deleteCampaign: (
    campaignId: string,
    characters: { uid: string; characterId: string }[]
  ) => void;
  setError: (error?: string) => void;
  setLoading: (isLoading: boolean) => void;
  createCampaign: (campaignLabel: string) => Promise<string>;

  addCharacterToCampaign: (
    campaignId: string,
    characterId: string
  ) => Promise<boolean>;
  updateCampaignSupply: (
    campaignId: string,
    supplyValue: number
  ) => Promise<boolean>;
  removeCharacterFromCampaign: (
    campaignId: string,
    characterId: string,
    userId: string
  ) => Promise<boolean>;
  updateCampaignGM: (
    campaignId: string,
    userId?: string | null
  ) => Promise<boolean>;
}

export const useCampaignStore = create<CampaignStore>()((set, getState) => ({
  campaigns: {},
  error: undefined,
  loading: true,

  createCampaign: (label: string) =>
    new Promise((resolve, reject) => {
      const uid = firebaseAuth.currentUser?.uid;
      if (uid) {
        const storedCampaign: StoredCampaign = {
          name: label,
          users: [uid],
          characters: [],
          supply: supplyTrack.startingValue,
        };
        addDoc(getCampaignCollection(), storedCampaign)
          .then((doc) => {
            resolve(doc.id);
          })
          .catch((e) => {
            console.error(e);
            reject("Error creating campaign");
          });
      } else {
        reject("User not found");
      }
    }),

  setCampaign: (campaignId: string, campaign: StoredCampaign) => {
    set(
      produce((state: CampaignStore) => {
        state.campaigns[campaignId] = campaign;
        state.loading = false;
      })
    );
  },
  removeCampaign: (campaignId: string) => {
    set(
      produce((state: CampaignStore) => {
        delete state.campaigns[campaignId];
      })
    );
  },

  deleteCampaign: async (
    campaignId: string,
    characters: { uid: string; characterId: string }[]
  ) => {
    const campaignDoc = getCampaignDoc(campaignId);

    try {
      const allUpdates = [];

      for (const { characterId, uid } of characters) {
        const updateDocPromise = updateDoc(getCharacterDoc(uid, characterId), {
          campaignId: deleteField(),
        });

        allUpdates.push(updateDocPromise);
      }

      const deleteDocPromise = deleteDoc(campaignDoc);

      await Promise.all([...allUpdates, deleteDocPromise]);
    } catch (error) {
      console.error(error);
    }
  },

  setError: (error?: string) => {
    set(
      produce((state: CampaignStore) => {
        state.error = error;
      })
    );
  },
  setLoading: (isLoading: boolean) => {
    set(
      produce((state: CampaignStore) => {
        state.loading = isLoading ?? false;
      })
    );
  },

  addCharacterToCampaign: (campaignId: string, characterId: string) =>
    new Promise<boolean>(async (resolve, reject) => {
      const uid = firebaseAuth.currentUser?.uid;

      if (uid) {
        try {
          let updateCampaign = updateDoc(getCampaignDoc(campaignId), {
            characters: arrayUnion({ uid, characterId }),
          });
          let updateCharacter = updateDoc(getCharacterDoc(uid, characterId), {
            campaignId: campaignId,
          });

          await Promise.all([updateCampaign, updateCharacter]);
          resolve(true);
        } catch (e) {
          console.error(e);
          reject("Error adding character to campaign");
        }
      } else {
        reject("User not found");
      }
    }),

  updateCampaignSupply: (campaignId: string, newValue: number) =>
    new Promise((resolve, reject) => {
      updateDoc(getCampaignDoc(campaignId), { supply: newValue })
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          console.error(error);
          reject("Failed to update campaign supply");
        });
    }),

  removeCharacterFromCampaign: async (
    campaignId,
    characterId,
    userId
  ): Promise<boolean> => {
    try {
      let campaignPromise = updateDoc(getCampaignDoc(campaignId), {
        characters: arrayRemove({ characterId, uid: userId }),
      });
      let characterPromise = updateDoc(getCharacterDoc(userId, characterId), {
        campaignId: deleteField(),
      });

      await Promise.all([campaignPromise, characterPromise]);
      return true;
    } catch (e) {
      console.error(e);
      throw new Error("Failed to remove character from campaign");
    }
  },

  updateCampaignGM: (campaignId, userId) =>
    new Promise((resolve, reject) => {
      updateDoc(getCampaignDoc(campaignId), { gmId: userId })
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          console.error(error);
          reject("Failed to update the campaign GM");
        });
    }),
}));
