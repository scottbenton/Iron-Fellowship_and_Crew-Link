import { CreateSliceType } from "stores/store.type";
import { CampaignCharactersSlice } from "./campaignCharacters.slice.type";
import { defaultCampaignCharactersSlice } from "./campaignCharacters.slice.default";
import { listenToCampaignCharacters } from "api-calls/campaign/listenToCampaignCharacters";
import { listenToAssets } from "api-calls/assets/listenToAssets";
import { updateCharacter } from "api-calls/character/updateCharacter";
import { listenToProgressTracks } from "api-calls/tracks/listenToProgressTracks";
import { TrackStatus, TrackTypes } from "types/Track.type";

export const createCampaignCharactersSlice: CreateSliceType<
  CampaignCharactersSlice
> = (set) => ({
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
        TrackStatus.Active,
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
                [TrackTypes.Fray]: {},
                [TrackTypes.Journey]: {},
                [TrackTypes.Vow]: {},
                [TrackTypes.DelveSite]: {},
                [TrackTypes.SceneChallenge]: {},
                [TrackTypes.Clock]: {},
              };
            }
            Object.keys(tracks).forEach((trackId) => {
              const track = tracks[trackId];
              store.campaigns.currentCampaign.characters.characterTracks[
                characterId
              ][track.type][trackId] = track;
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
