import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { deleteField, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "providers/AuthProvider";
import { getCharacterTracksDoc } from "./_getRef";
import { TRACK_TYPES } from "types/Track.type";

export const removeCharacterProgressTrack: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    type: TRACK_TYPES;
    id: string;
  },
  boolean
> = function (params) {
  const { uid, characterId, type, id } = params;

  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }
    if (!characterId) {
      reject(new CharacterNotFoundException());
      return;
    }

    updateDoc(getCharacterTracksDoc(uid, characterId), {
      [`${type}.${id}`]: deleteField(),
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to remove progress track");
      });
  });
};

export function useRemoveCharacterProgressTrack() {
  const { call, loading, error } = useApiState(removeCharacterProgressTrack);

  return {
    removeCharacterProgressTrack: call,
    loading,
    error,
  };
}

export function useCharacterSheetRemoveCharacterProgressTrack() {
  const { removeCharacterProgressTrack, loading, error } =
    useRemoveCharacterProgressTrack();

  const uid = useAuth().user?.uid;

  const characterId = useCharacterSheetStore((store) => store.characterId);

  return {
    removeCharacterProgressTrack: (params: { type: TRACK_TYPES; id: string }) =>
      removeCharacterProgressTrack({ uid, characterId, ...params }),
    loading,
    error,
  };
}
