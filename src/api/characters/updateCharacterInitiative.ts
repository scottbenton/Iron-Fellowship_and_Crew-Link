import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "hooks/useAuth";
import { INITIATIVE_STATUS } from "types/Character.type";
import { getCharacterDoc } from "./_getRef";

interface Params {
  uid?: string;
  characterId?: string;
  initiativeStatus: INITIATIVE_STATUS;
}

export const updateCharacterInititive: ApiFunction<Params, boolean> = (
  params
) => {
  const { uid, characterId, initiativeStatus } = params;

  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }
    if (!characterId) {
      reject(new CharacterNotFoundException());
      return;
    }

    updateDoc(getCharacterDoc(uid, characterId), {
      initiativeStatus,
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject(new Error("Failed to update initiative status"));
      });
  });
};

export function useUpdateCharacterInitiative() {
  const { call, loading, error } = useApiState(updateCharacterInititive);

  return {
    updateCharacterInitiative: (params: Params) => call(params),
    loading,
    error,
  };
}

export function useCharacterSheetUpdateCharacterInitiative() {
  const { updateCharacterInitiative, loading, error } =
    useUpdateCharacterInitiative();
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  return {
    updateCharacterInitiative: (initiativeStatus: INITIATIVE_STATUS) =>
      updateCharacterInitiative({
        uid,
        characterId,
        initiativeStatus,
      }),
    loading,
    error,
  };
}
