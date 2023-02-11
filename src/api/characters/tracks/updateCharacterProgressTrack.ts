import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "hooks/useAuth";
import { getCharacterTracksDoc } from "lib/firebase.lib";
import { TRACK_TYPES } from "types/Track.type";

export const updateCharacterProgressTrack: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    type: TRACK_TYPES;
    trackId: string;
    value: number;
  },
  boolean
> = function (params) {
  const { uid, characterId, type, trackId, value } = params;
  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }

    if (!characterId) {
      reject(new CharacterNotFoundException());
      return;
    }

    updateDoc(
      getCharacterTracksDoc(uid, characterId),
      //@ts-ignore
      {
        [`${type}.${trackId}.value`]: value,
      }
    )
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update progress track");
      });
  });
};

export function useUpdateCharacterProgressTrack() {
  const { call, loading, error } = useApiState(updateCharacterProgressTrack);

  return {
    updateCharacterProgressTrack: call,
    loading,
    error,
  };
}

export function useUpdateCharacterSheetCharacterProgressTrack() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  const { updateCharacterProgressTrack, loading, error } =
    useUpdateCharacterProgressTrack();

  return {
    updateCharacterProgressTrack: (params: {
      type: TRACK_TYPES;
      trackId: string;
      value: number;
    }) => updateCharacterProgressTrack({ ...params, uid, characterId }),
    loading,
    error,
  };
}
