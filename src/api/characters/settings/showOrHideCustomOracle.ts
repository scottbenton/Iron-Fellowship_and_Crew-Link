import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { arrayRemove, arrayUnion, setDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "providers/AuthProvider";
import { getCharacterSettingsDoc } from "./_getRef";

export const showOrHideCustomOracle: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    oracleId: string;
    hidden: boolean;
  },
  boolean
> = (params) => {
  const { uid, characterId, oracleId, hidden } = params;

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
        hiddenCustomOraclesIds: hidden
          ? arrayUnion(oracleId)
          : arrayRemove(oracleId),
      },
      { merge: true }
    )
      .then(() => resolve(true))
      .catch((e) => {
        console.error(e);
        reject("Failed to update visibility of custom oracle.");
      });
  });
};

export function useCharacterSheetShowOrHideCustomOracle() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);
  const { call, loading, error } = useApiState(showOrHideCustomOracle);

  return {
    showOrHideCustomOracle: (oracleId: string, hidden: boolean) =>
      call({ uid, characterId, oracleId, hidden }),
    loading,
    error,
  };
}
