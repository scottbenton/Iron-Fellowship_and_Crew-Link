import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { deleteDoc, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "providers/AuthProvider";
import {
  getCharacterNoteContentDocument,
  getCharacterNoteDocument,
} from "./_getRef";
import { NoteNotFoundException } from "api/error/NoteException";

export const removeCharacterNote: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    noteId?: string;
  },
  boolean
> = function (params) {
  const { uid, characterId, noteId } = params;
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

    const deleteNotePromise = deleteDoc(
      getCharacterNoteDocument(uid, characterId, noteId)
    );

    const deleteContentPromise = deleteDoc(
      getCharacterNoteContentDocument(uid, characterId, noteId)
    );

    Promise.all([deleteNotePromise, deleteContentPromise])
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update note.");
      });
  });
};

export function useRemoveCharacterNote() {
  const { call, loading, error } = useApiState(removeCharacterNote);

  return {
    removeCharacterNote: call,
    loading,
    error,
  };
}

export function useCharacterSheetRemoveCharacterNote() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  const { removeCharacterNote, loading, error } = useRemoveCharacterNote();

  return {
    removeCharacterNote: (params: { noteId: string }) =>
      removeCharacterNote({ ...params, uid, characterId }),
    loading,
    error,
  };
}
