import { CreateSliceType } from "stores/store.type";
import { CurrentCampaignSlice } from "./currentCampaign.slice.type";
import { defaultCurrentCampaignSlice } from "./currentCampaign.slice.default";
import { listenToCampaignCharacters } from "api-calls/campaign/listenToCampaignCharacters";
import { updateCampaignGM } from "api-calls/campaign/updateCampaignGM";
import { deleteCampaign } from "api-calls/campaign/deleteCampaign";
import { leaveCampaign } from "api-calls/campaign/leaveCampaign";
import { removeCharacterFromCampaign } from "api-calls/campaign/removeCharacterFromCampaign";
import { addCharacterToCampaign } from "api-calls/campaign/addCharacterToCampaign";
import { updateCampaignSupply } from "api-calls/campaign/updateCampaignSupply";
import { createCampaignTracksSlice } from "./tracks/campaignTracks.slice";

export const createCurrentCampaignSlice: CreateSliceType<
  CurrentCampaignSlice
> = (...params) => {
  const [set, getState] = params;
  return {
    ...defaultCurrentCampaignSlice,
    tracks: createCampaignTracksSlice(...params),
    setCurrentCampaignId: (campaignId) => {
      const state = getState();
      const campaign = campaignId
        ? state.campaigns.campaignMap[campaignId]
        : undefined;

      if (campaign?.users) {
        state.users.loadUserDocuments(campaign.users);
      }

      if (campaignId) {
        set((store) => {
          store.campaigns.currentCampaign.currentCampaignId = campaignId;
        });
        state.campaigns.currentCampaign.setCurrentCampaign(campaign);
      } else {
        state.campaigns.currentCampaign.resetStore();
      }
      state.worlds.currentWorld.setCurrentWorldId(campaign?.worldId);
    },
    setCurrentCampaign: (campaign) => {
      const state = getState();
      if (campaign) {
        state.users.loadUserDocuments(campaign.users);
        const loadedCharacterIds = Object.keys(
          state.campaigns.currentCampaign.currentCampaignCharacters ?? {}
        );
        const campaignCharacterIds = campaign?.characters.map(
          (character) => character.characterId
        );
        set((store) => {
          loadedCharacterIds.forEach((characterId) => {
            if (!campaignCharacterIds.includes(characterId)) {
              delete store.campaigns.currentCampaign.currentCampaignCharacters[
                characterId
              ];
            }
          });
        });
      }

      set((store) => {
        store.campaigns.currentCampaign.currentCampaign = campaign;
      });

      state.worlds.currentWorld.setCurrentWorldId(campaign?.worldId);
    },
    listenToCurrentCampaignCharacters: (characterIds: string[]) => {
      const unsubscribes = listenToCampaignCharacters({
        characterIdList: characterIds,
        onDocChange: (id, character) => {
          set((store) => {
            if (character) {
              store.campaigns.currentCampaign.currentCampaignCharacters[id] =
                character;
            } else {
              delete store.campaigns.currentCampaign.currentCampaignCharacters[
                id
              ];
            }
          });
        },
        onError: (error) => {
          console.error(error);
        },
      });
      return () => {
        unsubscribes.forEach((unsubscribe) => {
          unsubscribe();
        });
      };
    },
    updateCampaignGM: (gmId, shouldRemove) => {
      const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
      if (!campaignId) {
        return new Promise((res, reject) => reject("Campaign Id not found"));
      }
      return updateCampaignGM({ campaignId, gmId, shouldRemove });
    },

    deleteCampaign: () => {
      const state = getState();
      const campaignId = state.campaigns.currentCampaign.currentCampaignId;
      const characterIds =
        state.campaigns.currentCampaign.currentCampaign?.characters.map(
          (character) => character.characterId
        );

      if (!campaignId || characterIds === undefined) {
        return new Promise((res, reject) => reject("Campaign is not open"));
      }
      return deleteCampaign({ campaignId, characterIds });
    },
    leaveCampaign: () => {
      const state = getState();
      const uid = state.auth.uid;
      const campaignId = state.campaigns.currentCampaign.currentCampaignId;
      const campaign = state.campaigns.currentCampaign.currentCampaign;

      if (!campaign || !campaignId) {
        return new Promise((res, reject) => reject("Campaign is not open"));
      }

      return leaveCampaign({ uid, campaignId, campaign });
    },
    addCharacter: (characterId) => {
      const state = getState();
      const uid = state.auth.uid;
      const campaignId = state.campaigns.currentCampaign.currentCampaignId;

      if (!campaignId) {
        return new Promise((res, reject) => reject("No campaign found."));
      }
      return addCharacterToCampaign({ uid, characterId, campaignId });
    },
    removeCharacter: (characterId) => {
      const state = getState();
      const uid = state.auth.uid;
      const campaignId = state.campaigns.currentCampaign.currentCampaignId;

      if (!campaignId) {
        return new Promise((res, reject) => reject("No campaign found."));
      }
      return removeCharacterFromCampaign({ uid, campaignId, characterId });
    },
    updateCampaignSupply: (supply) => {
      const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
      if (!campaignId) {
        return new Promise((res, reject) => reject("No campaign found."));
      }
      return updateCampaignSupply({ campaignId, supply });
    },

    resetStore: () => {
      getState().campaigns.currentCampaign.tracks.resetStore();
      set((store) => {
        store.campaigns.currentCampaign = {
          ...store.campaigns.currentCampaign,
          ...defaultCurrentCampaignSlice,
        };
      });
    },
  };
};
