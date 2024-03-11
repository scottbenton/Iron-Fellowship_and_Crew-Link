import { CreateSliceType } from "stores/store.type";
import { CharacterSlice } from "./character.slice.type";
import { defaultCharacterSlice } from "./character.slice.default";
import { listenToUsersCharacters } from "api-calls/character/listenToUsersCharacters";
import { getErrorMessage } from "functions/getErrorMessage";
import { deleteCharacter } from "api-calls/character/deleteCharacter";
import { createCharacter } from "api-calls/character/createCharacter";
import { getCharacterPortraitUrl } from "api-calls/character/getCharacterPortrait";
import { createCurrentCharacterSlice } from "./currentCharacter/currentCharacter.slice";
import { updateCharacterPortrait } from "api-calls/character/updateCharacterPortrait";
import { momentumTrack } from "data/defaultTracks";

export const createCharacterSlice: CreateSliceType<CharacterSlice> = (
  ...params
) => {
  const [set, getState] = params;
  return {
    ...defaultCharacterSlice,

    currentCharacter: createCurrentCharacterSlice(...params),

    subscribe: (uid?: string) => {
      if (uid) {
        return listenToUsersCharacters(
          uid,
          {
            onDocChange: (characterId, characterDocument) => {
              set((store) => {
                store.characters.characterMap[characterId] = characterDocument;
                if (
                  store.characters.currentCharacter.currentCharacterId ===
                  characterId
                ) {
                  store.characters.currentCharacter.currentCharacter =
                    characterDocument;

                  const numberOfActiveDebilities = Object.values(
                    characterDocument.debilities ?? {}
                  ).filter((debility) => debility).length;

                  let momentumResetValue = momentumTrack.startingValue;

                  if (numberOfActiveDebilities >= 2) {
                    momentumResetValue = 0;
                  } else if (numberOfActiveDebilities === 1) {
                    momentumResetValue = 1;
                  }

                  store.characters.currentCharacter.momentumResetValue =
                    momentumResetValue;
                }
              });
            },
            onDocRemove: (characterId) => {
              set((store) => {
                delete store.characters.characterMap[characterId];
                if (
                  store.characters.currentCharacter.currentCharacterId ===
                  characterId
                ) {
                  store.characters.currentCharacter.currentCharacter =
                    undefined;
                  store.characters.currentCharacter.momentumResetValue =
                    undefined;
                }
              });
            },
            onLoaded: () => {
              set((store) => {
                store.characters.loading = false;
              });
            },
          },
          (error) => {
            set((store) => {
              const errorMessage = getErrorMessage(
                error,
                "Failed to load your characters."
              );
              store.characters.error = errorMessage;
              store.characters.loading = false;
            });
          }
        );
      }
    },
    loadCharacterPortrait: (uid, characterId, filename) => {
      const existingFilename =
        getState().characters.characterPortraitMap[characterId]?.filename;

      if (!filename) {
        set((state) => {
          delete state.characters.characterPortraitMap[characterId];
        });
      } else if (existingFilename !== filename) {
        set((state) => {
          state.characters.characterPortraitMap[characterId] = {
            loading: true,
            filename: filename,
          };
        });
        getCharacterPortraitUrl({ uid, characterId, filename })
          .then((url) => {
            set((state) => {
              state.characters.characterPortraitMap[characterId] = {
                loading: false,
                filename: filename,
                url,
              };
            });
          })
          .catch(() => {});
      }
    },

    createCharacter: (name, stats, assets, portrait, expansionIds) => {
      const uid = getState().auth.user?.uid;
      if (!uid) {
        return new Promise((res, reject) =>
          reject("You must be logged in to create a character")
        );
      }
      return new Promise((resolve) => {
        createCharacter({
          uid,
          name,
          stats,
          assets,
          expansionIds,
        }).then((characterId) => {
          if (
            portrait &&
            portrait.image &&
            typeof portrait.image !== "string"
          ) {
            updateCharacterPortrait({
              uid,
              characterId,
              portrait: portrait.image,
              scale: portrait.scale,
              position: portrait.position,
            })
              .then(() => {
                resolve(characterId);
              })
              .catch(() => {
                resolve(characterId);
              });
          } else {
            resolve(characterId);
          }
        });
      });
    },
    deleteCharacter: (characterId) => {
      const uid = getState().auth.uid;
      const character = getState().characters.characterMap[characterId];
      if (!character) {
        return new Promise((res, reject) =>
          reject("Could not find character in order to delete it.")
        );
      }
      return deleteCharacter({
        uid,
        characterId,
        campaignId: character.campaignId,
        portraitFilename: character.profileImage?.filename,
      });
    },
  };
};
