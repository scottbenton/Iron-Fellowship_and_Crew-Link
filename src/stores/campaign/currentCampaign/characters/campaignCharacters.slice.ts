import { CreateSliceType } from "stores/store.type";
import { CampaignCharactersSlice } from "./campaignCharacters.slice.type";
import { defaultCampaignCharactersSlice } from "./campaignCharacters.slice.default";
import { listenToCampaignCharacters } from "api-calls/campaign/listenToCampaignCharacters";
import { listenToAssets } from "api-calls/assets/listenToAssets";
import { updateCharacter } from "api-calls/character/updateCharacter";
import { listenToProgressTracks } from "api-calls/tracks/listenToProgressTracks";
import { TRACK_STATUS, TRACK_TYPES } from "types/Track.type";

export const createCampaignCharactersSlice: CreateSliceType<
  CampaignCharactersSlice
> = (set, getState) => ({
  ...defaultCampaignCharactersSlice,

  listenToCampaignCharacters: (characterIds: string[]) => {
    const unsubscribes = listenToCampaignCharacters({
      characterIdList: characterIds,
      onDocChange: (id, character) => {
        set((store) => {
          if (character) {
            store.campaigns.currentCampaign.characters.characterMap[id] =
              character;
          } else {
            delete store.campaigns.currentCampaign.characters.characterMap[id];
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
  listenToCampaignCharacterAssets: (characterIds: string[]) => {
    const unsubscribes = characterIds.map((characterId) => {
      return listenToAssets(
        characterId,
        undefined,
        (assets) => {
          set((store) => {
            if (assets) {
              store.campaigns.currentCampaign.characters.characterAssets[
                characterId
              ] = Object.values(assets);
            } else {
              delete store.campaigns.currentCampaign.characters.characterAssets[
                characterId
              ];
            }
          });
        },
        (error) => {
          console.error(error);
        }
      );
    });
    return () => {
      unsubscribes.forEach((unsubscribe) => {
        unsubscribe();
      });
    };
  },
  listenToCampaignCharacterTracks: (characterIds: string[]) => {
    const unsubscribes = characterIds.map((characterId) => {
      return listenToProgressTracks(
        undefined,
        characterId,
        TRACK_STATUS.ACTIVE,
        (tracks) => {
          set((store) => {
            if (
              !store.campaigns.currentCampaign.characters.characterTracks[
                characterId
              ]
            ) {
              store.campaigns.currentCampaign.characters.characterTracks[
                characterId
              ] = {
                [TRACK_TYPES.FRAY]: {},
                [TRACK_TYPES.JOURNEY]: {},
                [TRACK_TYPES.VOW]: {},
              };
            }
            Object.keys(tracks).forEach((trackId) => {
              const track = tracks[trackId];
              switch (track.type) {
                case TRACK_TYPES.FRAY:
                  store.campaigns.currentCampaign.characters.characterTracks[
                    characterId
                  ][TRACK_TYPES.FRAY][trackId] = track;
                  break;
                case TRACK_TYPES.JOURNEY:
                  store.campaigns.currentCampaign.characters.characterTracks[
                    characterId
                  ][TRACK_TYPES.JOURNEY][trackId] = track;
                  break;
                case TRACK_TYPES.VOW:
                  store.campaigns.currentCampaign.characters.characterTracks[
                    characterId
                  ][TRACK_TYPES.VOW][trackId] = track;
                  break;
                default:
                  break;
              }
            });
          });
        },

        (trackId, type) => {
          set((store) => {
            delete store.campaigns.currentCampaign.characters.characterTracks[
              characterId
            ][type][trackId];
          });
        },
        (error) => {
          console.error(error);
        }
      );
    });
    return () => {
      unsubscribes.forEach((unsubscribe) => {
        unsubscribe && unsubscribe();
      });
    };
  },

  updateCharacter: (characterId, character) => {
    return updateCharacter({ characterId, character });
  },

  resetStore: () => {
    set((store) => {
      store.campaigns.currentCampaign.characters = {
        ...store.campaigns.currentCampaign.characters,
        ...defaultCampaignCharactersSlice,
      };
    });
  },
});
