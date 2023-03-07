import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { addDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "hooks/useAuth";
import { getCharacterNoteCollection } from "./_getRef";

export const addCharacterNote: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    order: number;
  },
  boolean
> = function (params) {
  const { uid, characterId, order } = params;

  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }

    if (!characterId) {
      reject(new CharacterNotFoundException());
      return;
    }

    addDoc(getCharacterNoteCollection(uid, characterId), {
      order,
      title: "New Page",
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to add note");
      });
  });
};

export function useAddCharacterNote() {
  const { call, loading, error } = useApiState(addCharacterNote);

  return {
    addCharacterNote: call,
    loading,
    error,
  };
}

export function useCharacterSheetAddCharacterNote() {
  const { addCharacterNote, loading, error } = useAddCharacterNote();

  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);
  const order = useCharacterSheetStore((store) =>
    Array.isArray(store.notes) && store.notes.length > 0
      ? store.notes[store.notes.length - 1].order + 1
      : 1
  );

  return {
    addCharacterNote: () => addCharacterNote({ uid, characterId, order }),
    loading,
    error,
  };
}
