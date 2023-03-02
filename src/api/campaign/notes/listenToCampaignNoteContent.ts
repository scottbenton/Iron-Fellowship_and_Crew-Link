import { onSnapshot, Unsubscribe } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "functions/getErrorMessage";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import { getCampaignNoteContentDocument } from "./_getRef";

export function listenToNoteContent(
  campaignId: string,
  noteId: string,
  onContent: (content?: string) => void,
  onError: (error: any) => void
): Unsubscribe {
  return onSnapshot(
    getCampaignNoteContentDocument(campaignId, noteId),
    (snapshot) => {
      onContent(snapshot.data()?.content ?? "");
    },
    (error) => onError(error)
  );
}

export function useListenToCampaignNoteContent(
  campaignId?: string,
  setNoteContentExt?: (notes?: string) => void
) {
  const [noteId, setNoteId] = useState<string>();
  const [noteContent, setNoteContent] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  const { error } = useSnackbar();

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    setLoading(true);
    if (campaignId && noteId) {
      listenToNoteContent(
        campaignId,
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
  }, [campaignId, noteId]);

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
