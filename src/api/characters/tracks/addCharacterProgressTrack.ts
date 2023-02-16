import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { setDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "hooks/useAuth";
import { getCharacterTracksDoc } from "./_getRef";
import { StoredTrack, TRACK_TYPES } from "types/Track.type";

export const addCharacterProgressTrack: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    type: TRACK_TYPES;
    track: StoredTrack;
  },
  boolean
> = function (params) {
  const { uid, characterId, type, track } = params;

  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }

    if (!characterId) {
      reject(new CharacterNotFoundException());
      return;
    }

    setDoc(
      getCharacterTracksDoc(uid, characterId),
      {
        [type]: {
          [track.label + track.createdTimestamp.toString()]: track,
        },
      },
      { merge: true }
    )
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to add track");
      });
  });
};

export function useAddCharacterProgressTrack() {
  const { call, loading, error } = useApiState(addCharacterProgressTrack);

  return {
    addCharacterProgressTrack: call,
    loading,
    error,
  };
}

export function useCharacterSheetAddCharacterProgressTrack() {
  const { addCharacterProgressTrack, loading, error } =
    useAddCharacterProgressTrack();

  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  return {
    addCharacterProgressTrack: (params: {
      type: TRACK_TYPES;
      track: StoredTrack;
    }) => addCharacterProgressTrack({ uid, characterId, ...params }),
    loading,
    error,
  };
}
