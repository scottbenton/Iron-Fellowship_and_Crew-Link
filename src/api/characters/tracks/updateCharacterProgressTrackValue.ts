import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "providers/AuthProvider";
import { getCharacterTracksDoc } from "./_getRef";
import { TRACK_TYPES } from "types/Track.type";

export const updateCharacterProgressTrackValue: ApiFunction<
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

export function useUpdateCharacterProgressTrackValue() {
  const { call, loading, error } = useApiState(
    updateCharacterProgressTrackValue
  );

  return {
    updateCharacterProgressTrackValue: call,
    loading,
    error,
  };
}

export function useUpdateCharacterSheetCharacterProgressTrackValue() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  const { updateCharacterProgressTrackValue, loading, error } =
    useUpdateCharacterProgressTrackValue();

  return {
    updateCharacterProgressTrackValue: (params: {
      type: TRACK_TYPES;
      trackId: string;
      value: number;
    }) => updateCharacterProgressTrackValue({ ...params, uid, characterId }),
    loading,
    error,
  };
}
