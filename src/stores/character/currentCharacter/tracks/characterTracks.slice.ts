import { CreateSliceType } from "stores/store.type";
import { CharacterTracksSlice } from "./characterTracks.slice.type";
import { defaultCharacterTracksSlice } from "./characterTracks.slice.default";
import { listenToProgressTracks } from "api-calls/tracks/listenToProgressTracks";
import { TRACK_STATUS, TRACK_TYPES } from "types/Track.type";
import { addProgressTrack } from "api-calls/tracks/addProgressTrack";
import { updateProgressTrack } from "api-calls/tracks/updateProgressTrack";
import { removeProgressTrack } from "api-calls/tracks/removeProgressTrack";

export const createCharacterTracksSlice: CreateSliceType<
  CharacterTracksSlice
> = (set, getState) => ({
  ...defaultCharacterTracksSlice,

  subscribe: (characterId, status = TRACK_STATUS.ACTIVE) => {
    const unsubscribe = listenToProgressTracks(
      undefined,
      characterId,
      status,
      (tracks) => {
        set((store) => {
          Object.keys(tracks).forEach((trackId) => {
            const track = tracks[trackId];
            switch (track.type) {
              case TRACK_TYPES.FRAY:
                store.characters.currentCharacter.tracks.trackMap[
                  TRACK_TYPES.FRAY
                ][trackId] = track;
                break;
              case TRACK_TYPES.JOURNEY:
                store.characters.currentCharacter.tracks.trackMap[
                  TRACK_TYPES.JOURNEY
                ][trackId] = track;
                break;
              case TRACK_TYPES.VOW:
                store.characters.currentCharacter.tracks.trackMap[
                  TRACK_TYPES.VOW
                ][trackId] = track;
                break;
              default:
                break;
            }
          });
        });
      },
      (trackId, type) => {
        set((store) => {
          delete store.characters.currentCharacter.tracks.trackMap[type][
            trackId
          ];
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

  addTrack: (track) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    return addProgressTrack({ characterId, track });
  },
  updateTrack: (trackId, track) => {
    const characterId =
      getState().characters.currentCharacter.currentCharacterId;
    return updateProgressTrack({ characterId, trackId, track });
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
