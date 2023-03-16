import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { arrayRemove, arrayUnion, setDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "hooks/useAuth";
import { getCharacterSettingsDoc } from "./_getRef";

export const showOrHideCustomMove: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    moveId: string;
    hidden: boolean;
  },
  boolean
> = (params) => {
  const { uid, characterId, moveId, hidden } = params;

  return new Promise((resolve, reject) => {
    if (!uid) {
      throw new UserNotLoggedInException();
      return;
    }
    if (!characterId) {
      throw new CharacterNotFoundException();
      return;
    }

    setDoc(
      getCharacterSettingsDoc(uid, characterId),
      {
        hiddenCustomMoveIds: hidden ? arrayUnion(moveId) : arrayRemove(moveId),
      },
      { merge: true }
    )
      .then(() => resolve(true))
      .catch((e) => {
        console.error(e);
        reject("Failed to update visibility of custom move.");
      });
  });
};

export function useCharacterSheetShowOrHideCustomMove() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);
  const { call, loading, error } = useApiState(showOrHideCustomMove);

  return {
    showOrHideCustomMove: (moveId: string, hidden: boolean) =>
      call({ uid, characterId, moveId, hidden }),
    loading,
    error,
  };
}
