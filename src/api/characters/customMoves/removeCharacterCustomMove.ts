import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { arrayRemove, deleteField, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "hooks/useAuth";
import { getCharacterCustomMovesDoc } from "./_getRef";

export const removeCharacterCustomMove: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    moveId: string;
  },
  boolean
> = function (params) {
  const { uid, characterId, moveId } = params;

  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }

    if (!characterId) {
      reject(new CharacterNotFoundException());
      return;
    }

    updateDoc(getCharacterCustomMovesDoc(uid, characterId), {
      [`moves.${moveId}`]: deleteField(),
      moveOrder: arrayRemove(moveId),
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to remove custom move");
      });
  });
};

export function useRemoveCharacterCustomMove() {
  const { call, loading, error } = useApiState(removeCharacterCustomMove);

  return {
    removeCharacterCustomMove: call,
    loading,
    error,
  };
}

export function useCharacterSheetRemoveCharacterCustomMove() {
  const { call, loading, error } = useApiState(removeCharacterCustomMove);

  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  return {
    removeCharacterCustomMove: (moveId: string) =>
      call({ uid, characterId, moveId }),
    loading,
    error,
  };
}
