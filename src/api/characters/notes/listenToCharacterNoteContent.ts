import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "functions/getErrorMessage";
import { useAuth } from "providers/AuthProvider";
import { useSnackbar } from "hooks/useSnackbar";
import { getCharacterNoteContentDocument } from "./_getRef";
import { useCharacterSheetStore } from "pages/Character/CharacterSheetPage/characterSheet.store";

export function listenToNoteContent(
  uid: string,
  characterId: string,
  noteId: string,
  onContent: (content?: string) => void,
  onError: (error: any) => void
): Unsubscribe {
  return onSnapshot(
    getCharacterNoteContentDocument(uid, characterId, noteId),
    (snapshot) => {
      onContent(snapshot.data()?.content ?? "");
    },
    (error) => onError(error)
  );
}

export function useListenToCharacterNoteContent(
  uid?: string,
  characterId?: string,
  setNoteContentExt?: (notes?: string) => void
) {
  const [noteId, setNoteId] = useState<string>();
  const [noteContent, setNoteContent] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    setLoading(true);
    if (uid && characterId && noteId) {
      listenToNoteContent(
        uid,
        characterId,
        noteId,
        (notes) => {
          setNoteContent(notes);
          setNoteContentExt && setNoteContentExt(notes);
          setLoading(false);
        },
        (err) => {
          console.error(err);
          const errorMessage = getErrorMessage(
            error,
            "Failed to load campaigns"
          );
          error(errorMessage);
        }
      );
    } else {
      setNoteContent(undefined);
      setNoteContentExt && setNoteContentExt(undefined);
      setLoading(false);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid, characterId, noteId]);

  const handleNoteId = useCallback((newId?: string) => {
    setNoteId((prevId) => {
      if (newId !== prevId) {
        setNoteContent(undefined);
        setLoading(true);
      }
      return newId;
    });
  }, []);

  return {
    noteContent,
    loading,
    noteId,
    setNoteId: handleNoteId,
  };
}

// Connects to the character sheet store
export function useListenToCharacterSheetNoteContent() {
  const uid = useAuth().user?.uid;
  const campaignId = useCharacterSheetStore((store) => store.characterId);

  return useListenToCharacterNoteContent(uid, campaignId);
}
