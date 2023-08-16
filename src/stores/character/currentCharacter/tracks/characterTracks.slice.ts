import { CreateSliceType } from "stores/store.type";
import { CharacterTracksSlice } from "./characterTracks.slice.type";
import { defaultCharacterTracksSlice } from "./characterTracks.slice.default";
import { listenToProgressTracks } from "api-calls/tracks/listenToProgressTracks";
import { StoredTrack, TRACK_TYPES } from "types/Track.type";
import { addProgressTrack } from "api-calls/tracks/addProgressTrack";
import { updateProgressTrack } from "api-calls/tracks/updateProgressTrack";
import { updateProgressTrackValue } from "api-calls/tracks/updateProgressTrackValue";
import { removeProgressTrack } from "api-calls/tracks/removeProgressTrack";

export const createCharacterTracksSlice: CreateSliceType<
  CharacterTracksSlice
> = (set, getState) => ({
  ...defaultCharacterTracksSlice,

  subscribe: (characterId) => {
    const unsubscribe = listenToProgressTracks(
      characterId,
      undefined,
      (vows, journeys, frays) => {
        set((store) => {
          store.characters.currentCharacter.tracks.trackMap = {
            [TRACK_TYPES.FRAY]: frays,
            [TRACK_TYPES.JOURNEY]: journeys,
            [TRACK_TYPES.VOW]: vows,
          };
        });
      },
      (error) => {
        console.error(error);
      }
    );

    if (!unsubscribe) {
      return () => {};
    }
    return unsubscribe;
  },

  addTrack: (type, track) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    return addProgressTrack({ characterId, track, type });
  },
  updateTrack: (type, trackId, track) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    return updateProgressTrack({ characterId, trackId, track, type });
  },
  updateTrackValue: (type, trackId, value) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    return updateProgressTrackValue({ characterId, trackId, value, type });
  },
  removeTrack: (type, id) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    return removeProgressTrack({ characterId, type, id });
  },

  resetStore: () => {
    set((store) => {
      store.characters.currentCharacter.tracks = {
        ...store.characters.currentCharacter.tracks,
        ...defaultCharacterTracksSlice,
      };
    });
  },
});
