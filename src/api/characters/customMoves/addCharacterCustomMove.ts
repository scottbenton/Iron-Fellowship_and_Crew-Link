import { arrayUnion, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getCharacterCustomMovesDoc } from "./_getRef";
import { StoredMove } from "types/Moves.type";
import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { useAuth } from "hooks/useAuth";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { encodeDataswornId } from "functions/dataswornIdEncoder";

export const addCharacterCustomMove: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    customMove: StoredMove;
  },
  boolean
> = function (params) {
  const { uid, characterId, customMove } = params;

  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new CharacterNotFoundException());
      return;
    }

    if (!characterId) {
      reject(new CharacterNotFoundException());
      return;
    }

    const encodedId = encodeDataswornId(customMove.$id);
    updateDoc(getCharacterCustomMovesDoc(uid, characterId), {
      [`moves.${encodedId}`]: customMove,
      moveOrder: arrayUnion(encodedId),
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to add track");
      });
  });
};

export function useAddCharacterCustomMove() {
  const { call, loading, error } = useApiState(addCharacterCustomMove);

  return {
    addCharacterCustomMove: call,
    loading,
    error,
  };
}

export function useCharacterSheetAddCustomMove() {
  const { addCharacterCustomMove, loading, error } =
    useAddCharacterCustomMove();

  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  return {
    addCharacterCustomMove: (move: StoredMove) =>
      addCharacterCustomMove({ uid, characterId, customMove: move }),
    loading,
    error,
  };
}
