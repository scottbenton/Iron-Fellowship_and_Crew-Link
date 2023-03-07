import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "hooks/useAuth";
import {
  getCharacterNoteContentDocument,
  getCharacterNoteDocument,
} from "./_getRef";
import { NoteNotFoundException } from "api/error/NoteException";

export const updateCharacterNoteOrder: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    noteId?: string;
    order: number;
  },
  boolean
> = function (params) {
  const { uid, characterId, noteId, order } = params;
  return new Promise((resolve, reject) => {
    if (!uid) {
      reject(new UserNotLoggedInException());
      return;
    }

    if (!characterId) {
      reject(new CharacterNotFoundException());
      return;
    }

    if (!noteId) {
      reject(new NoteNotFoundException());
      return;
    }

    updateDoc(getCharacterNoteDocument(uid, characterId, noteId), {
      order,
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to reorder note.");
      });
  });
};

export function useUpdateCharacterNoteOrder() {
  const { call, loading, error } = useApiState(updateCharacterNoteOrder);

  return {
    updateCharacterNoteOrder: call,
    loading,
    error,
  };
}

export function useCharacterSheetUpdateCharacterNoteOrder() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  const { updateCharacterNoteOrder, loading, error } =
    useUpdateCharacterNoteOrder();

  return {
    updateCharacterNoteOrder: (params: { noteId: string; order: number }) =>
      updateCharacterNoteOrder({ ...params, uid, characterId }),
    loading,
    error,
  };
}
