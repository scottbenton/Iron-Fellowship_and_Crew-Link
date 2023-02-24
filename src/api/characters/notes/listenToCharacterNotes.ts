import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getErrorMessage } from "functions/getErrorMessage";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import { getCharacterNoteCollection } from "./_getRef";
import { useCharacterSheetStore } from "features/character-sheet/characterSheet.store";
import { Note } from "types/Notes.type";

export function listenToNotes(
  uid: string,
  characterId: string,
  onNotes: (notes: Note[]) => void,
  onError: (error: any) => void
): Unsubscribe {
  return onSnapshot(
    getCharacterNoteCollection(uid, characterId),
    (snapshot) => {
      const notes: Note[] = snapshot.docs
        .map((doc) => {
          const noteDoc = doc.data();

          return {
            noteId: doc.id,
            ...noteDoc,
          };
        })
        .sort((n1, n2) => n1.order - n2.order);

      onNotes(notes);
    },
    (error) => onError(error)
  );
}

export function useListenToCharacterNotes(
  uid?: string,
  characterId?: string,
  setNotesExt?: (notes: Note[]) => void
) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (uid && characterId) {
      listenToNotes(
        uid,
        characterId,
        (notes) => {
          setNotes(notes);
          setNotesExt && setNotesExt(notes);
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
      setNotes([]);
      setNotesExt && setNotesExt([]);
      setLoading(false);
    }

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [uid, characterId]);

  return {
    notes,
    loading,
  };
}

// Connects to the character sheet store
export function useListenToCharacterSheetNotes() {
  const uid = useAuth().user?.uid;
  const campaignId = useCharacterSheetStore((store) => store.characterId);
  const setNotes = useCharacterSheetStore((store) => store.setNotes);

  return useListenToCharacterNotes(uid, campaignId, setNotes);
}
