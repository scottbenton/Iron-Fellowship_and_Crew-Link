import { CharacterNotFoundException } from "api/error/CharacterNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { setDoc, updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "hooks/useAuth";
import {
  constructCharacterNoteContentPath,
  constructCharacterNoteDocPath,
  getCharacterNoteContentDocument,
  getCharacterNoteDocument,
} from "./_getRef";
import { NoteNotFoundException } from "api/error/NoteException";
import { firebaseAuth } from "config/firebase.config";

export const updateCharacterNote: ApiFunction<
  {
    uid?: string;
    characterId?: string;
    noteId?: string;
    title: string;
    content?: string;
    isBeaconRequest?: boolean;
  },
  boolean
> = function (params) {
  const { uid, characterId, noteId, title, content, isBeaconRequest } = params;

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

    // If we are making this call when closing the page, we want to use a fetch call with keepalive
    if (isBeaconRequest) {
      const contentPath = `projects/${
        import.meta.env.VITE_FIREBASE_PROJECTID
      }/databases/(default)/documents${constructCharacterNoteContentPath(
        uid,
        characterId,
        noteId
      )}`;
      const titlePath = `projects/${
        import.meta.env.VITE_FIREBASE_PROJECTID
      }/databases/(default)/documents${constructCharacterNoteDocPath(
        uid,
        characterId,
        noteId
      )}`;

      const token = (firebaseAuth.currentUser?.toJSON() as any).stsTokenManager
        .accessToken;
      if (content) {
        fetch(
          `https://firestore.googleapis.com/v1/${contentPath}?updateMask.fieldPaths=content`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: contentPath,
              fields: {
                content: {
                  stringValue: content,
                },
              },
            }),
            keepalive: true,
          }
        ).catch((e) => console.error(e));
      }
      fetch(
        `https://firestore.googleapis.com/v1/${titlePath}?updateMask.fieldPaths=title`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: titlePath,
            fields: {
              title: {
                stringValue: title,
              },
            },
          }),
          keepalive: true,
        }
      ).catch((e) => console.error(e));

      resolve(true);
    } else {
      const promises: Promise<any>[] = [];

      promises.push(
        updateDoc(getCharacterNoteDocument(uid, characterId, noteId), {
          title,
        })
      );

      if (content) {
        promises.push(
          setDoc(getCharacterNoteContentDocument(uid, characterId, noteId), {
            content,
          })
        );
      }

      Promise.all(promises)
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          console.error(e);
          reject("Failed to update note");
        });
    }
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
      content?: string;
    }) => updateCharacterNote({ ...params, uid, characterId }),
    loading,
    error,
  };
}
