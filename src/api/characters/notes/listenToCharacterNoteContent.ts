import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getErrorMessage } from "functions/getErrorMessage";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import { getCharacterNoteContentDocument } from "./_getRef";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";

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
      onContent(snapshot.data()?.content);
    },
    (error) => onError(error)
  );
}

export function useListenToCharacterNoteContent(
  uid?: string,
  characterId?: string,
  noteId?: string,
  setNoteContentExt?: (notes?: string) => void
) {
  const [noteContent, setNoteContent] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

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
  }, [uid, characterId]);

  return {
    noteContent,
    loading,
  };
}

// Connects to the character sheet store
export function useListenToCharacterSheetNoteContent(noteId?: string) {
  const uid = useAuth().user?.uid;
  const campaignId = useCharacterSheetStore((store) => store.characterId);

  return useListenToCharacterNoteContent(uid, campaignId, noteId);
}
