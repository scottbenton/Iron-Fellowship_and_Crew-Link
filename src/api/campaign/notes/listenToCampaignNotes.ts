import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getErrorMessage } from "functions/getErrorMessage";
import { useSnackbar } from "hooks/useSnackbar";
import { getCampaignNoteCollection } from "./_getRef";
import { Note } from "types/Notes.type";

export function listenToNotes(
  campaignId: string,
  onNotes: (notes: Note[]) => void,
  onError: (error: any) => void
): Unsubscribe {
  return onSnapshot(
    getCampaignNoteCollection(campaignId),
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

export function useListenToCampaignNotes(
  campaignId?: string,
  setNotesExt?: (notes: Note[]) => void
) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (campaignId) {
      listenToNotes(
        campaignId,
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
  }, [campaignId]);

  const temporarilyReorderNotes = (noteId: string, order: number) => {
    setNotes((prevNotes) => {
      if (!prevNotes) return prevNotes;

      let notes = [...prevNotes];

      const noteIndex = notes.findIndex((note) => note.noteId === noteId);

      if (typeof noteIndex !== "number" || noteIndex < 0) return prevNotes;

      notes[noteIndex].order = order;
      notes.sort((n1, n2) => n1.order - n2.order);

      return notes;
    });
  };

  return {
    notes,
    loading,
    temporarilyReorderNotes,
  };
}
