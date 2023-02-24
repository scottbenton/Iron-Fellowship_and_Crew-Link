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

export const updateCharacterNote: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    noteId?: string;
    title: string;
    content: string;
  },
  boolean
> = function (params) {
  const { uid, characterId, noteId, title, content } = params;
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

    const updateTitlePromise = updateDoc(
      getCharacterNoteDocument(uid, characterId, noteId),
      {
        title,
      }
    );

    const updateContentPromise = updateDoc(
      getCharacterNoteContentDocument(uid, characterId, noteId),
      {
        content,
      }
    );

    Promise.all([updateTitlePromise, updateContentPromise])
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update note.");
      });
  });
};

export function useUpdateCharacterNote() {
  const { call, loading, error } = useApiState(updateCharacterNote);

  return {
    updateCharacterNote: call,
    loading,
    error,
  };
}

export function useCharacterSheetUpdateCharacterNote() {
  const uid = useAuth().user?.uid;
  const characterId = useCharacterSheetStore((store) => store.characterId);

  const { updateCharacterNote, loading, error } = useUpdateCharacterNote();

  return {
    updateCharacterNote: (params: {
      noteId: string;
      title: string;
      content: string;
    }) => updateCharacterNote({ ...params, uid, characterId }),
    loading,
    error,
  };
}
