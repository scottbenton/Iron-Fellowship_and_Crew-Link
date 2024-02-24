import { CreateSliceType } from "stores/store.type";
import { CurrentCampaignSlice } from "./currentCampaign.slice.type";
import { defaultCurrentCampaignSlice } from "./currentCampaign.slice.default";
import { updateCampaignGM } from "api-calls/campaign/updateCampaignGM";
import { deleteCampaign } from "api-calls/campaign/deleteCampaign";
import { leaveCampaign } from "api-calls/campaign/leaveCampaign";
import { removeCharacterFromCampaign } from "api-calls/campaign/removeCharacterFromCampaign";
import { addCharacterToCampaign } from "api-calls/campaign/addCharacterToCampaign";
import { updateCampaign } from "api-calls/campaign/updateCampaign";
import { createCampaignTracksSlice } from "./tracks/campaignTracks.slice";
import { createCampaignCharactersSlice } from "./characters/campaignCharacters.slice";
import { updateCampaignWorld } from "api-calls/campaign/updateCampaignWorld";
import { createSharedAssetsSlice } from "./sharedAssets/sharedAssets.slice";

export const createCurrentCampaignSlice: CreateSliceType<
  CurrentCampaignSlice
> = (...params) => {
  const [set, getState] = params;
  return {
    ...defaultCurrentCampaignSlice,

    assets: createSharedAssetsSlice(...params),
    characters: createCampaignCharactersSlice(...params),
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
          state.campaigns.currentCampaign.characters.characterMap ?? {}
        );
        const campaignCharacterIds = campaign?.characters.map(
          (character) => character.characterId
        );
        set((store) => {
          loadedCharacterIds.forEach((characterId) => {
            if (!campaignCharacterIds.includes(characterId)) {
              delete store.campaigns.currentCampaign.characters.characterMap[
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

    updateCampaignWorld: (worldId) => {
      const state = getState();
      const campaignId = state.campaigns.currentCampaign.currentCampaignId;
      const gmIds =
        state.campaigns.currentCampaign.currentCampaign?.gmIds ?? [];

      if (!campaignId) {
        return new Promise((res, reject) => reject("Campaign Id not found"));
      }
      return updateCampaignWorld({ campaignId, gmIds, worldId });
    },
    updateCampaignGM: (gmId, shouldRemove) => {
      const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
      const worldId =
        getState().campaigns.currentCampaign.currentCampaign?.worldId;
      if (!campaignId) {
        return new Promise((res, reject) => reject("Campaign Id not found"));
      }
      return updateCampaignGM({ campaignId, worldId, gmId, shouldRemove });
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
    removePlayerFromCampaign: (uid: string) => {
      const state = getState();
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
      return updateCampaign({ campaignId, campaign: { supply } });
    },
    updateCampaign: (campaign) => {
      const campaignId = getState().campaigns.currentCampaign.currentCampaignId;
      if (!campaignId) {
        return new Promise((res, reject) => reject("No campaign found."));
      }
      return updateCampaign({ campaignId, campaign });
    },

    resetStore: () => {
      const state = getState();
      state.campaigns.currentCampaign.tracks.resetStore();
      state.campaigns.currentCampaign.characters.resetStore();
      state.campaigns.currentCampaign.assets.resetStore();
      state.notes.resetStore();
      state.settings.resetStore();
      state.gameLog.resetStore();

      set((store) => {
        store.campaigns.currentCampaign = {
          ...store.campaigns.currentCampaign,
          ...defaultCurrentCampaignSlice,
        };
      });
    },
  };
};
