import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { deleteField, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "providers/AuthProvider";
import { getCharacterDoc } from "./_getRef";

export const updateCharacterWorld: ApiFunction<
  { uid?: string; characterId?: string; worldId?: string },
  boolean
> = (params) => {
  const { uid, characterId, worldId } = params;
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
      worldId: worldId ? worldId : deleteField(),
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject(new Error("Failed to update world."));
      });
  });
};

export function useCharacterSheetUpdateCharacterWorld() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  const { call, loading } = useApiState(updateCharacterWorld);

  return {
    updateCharacterWorld: (worldId?: string) =>
      call({ uid, characterId, worldId }),
    loading,
  };
}
