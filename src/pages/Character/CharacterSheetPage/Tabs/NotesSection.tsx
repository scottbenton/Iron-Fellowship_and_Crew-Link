import { Box, LinearProgress, useMediaQuery, useTheme } from "@mui/material";
import { Notes } from "components/Notes/Notes";
import { useEffect } from "react";
import { useStore } from "stores/store";

export function NotesSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const notes = useStore((store) => store.notes.notes);
  const temporarilyReorderNotes = useStore(
    (store) => store.notes.temporarilyReorderNotes
  );

  const noteContent = useStore((store) => store.notes.openNoteContent);
  const openNoteId = useStore((store) => store.notes.openNoteId);
  const setNoteId = useStore((store) => store.notes.setOpenNoteId);

  const addCharacterNote = useStore((store) => store.notes.addNote);
  const updateCharacterNote = useStore((store) => store.notes.updateNote);
  const updateCharacterNoteOrder = useStore(
    (store) => store.notes.updateNoteOrder
  );
  const removeCharacterNote = useStore((store) => store.notes.removeNote);

  useEffect(() => {
    if (Array.isArray(notes) && notes.length > 0 && !openNoteId && !isMobile) {
      setNoteId(notes[notes.length - 1].noteId);
    } else if (!Array.isArray(notes) || notes.length === 0) {
      setNoteId(undefined);
    }
  }, [notes, setNoteId, openNoteId, isMobile]);

  if (!Array.isArray(notes)) {
    return <LinearProgress />;
  }

  const handleNoteReorder = (noteId: string, order: number) => {
    temporarilyReorderNotes(noteId, order);
    return updateCharacterNoteOrder(noteId, order);
  };

  return (
    <Box height={"100%"}>
      <Notes
        notes={notes}
        selectedNoteId={openNoteId}
        selectedNoteContent={noteContent}
        openNote={(noteId) => setNoteId(noteId)}
        createNote={() =>
          addCharacterNote(
            notes && notes.length > 0 ? notes[notes.length - 1].order + 1 : 1
          )
        }
        updateNoteOrder={handleNoteReorder}
        onSave={({ noteId, title, content, isBeaconRequest }) =>
          updateCharacterNote(noteId, title, content, isBeaconRequest)
        }
        condensedView={isMobile}
        onDelete={(noteId) =>
          removeCharacterNote(noteId)
            .then(() => {
              setNoteId(undefined);
            })
            .catch(() => {})
        }
      />
    </Box>
  );
}
