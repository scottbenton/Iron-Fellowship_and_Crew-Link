import { Box, LinearProgress, useMediaQuery, useTheme } from "@mui/material";
import { useCharacterSheetAddCharacterNote } from "api/characters/notes/addCharacterNote";
import { useListenToCharacterSheetNoteContent } from "api/characters/notes/listenToCharacterNoteContent";
import {
  useCharacterSheetRemoveCharacterNote,
  useRemoveCharacterNote,
} from "api/characters/notes/removeCharacterNote";
import { useCharacterSheetUpdateCharacterNote } from "api/characters/notes/updateCharacterNote";
import { useCharacterSheetUpdateCharacterNoteOrder } from "api/characters/notes/updateCharacterNoteOrder";
import { Notes } from "components/Notes/Notes";
import { useEffect } from "react";
import { useCharacterSheetStore } from "../characterSheet.store";

export function NotesSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const notes = useCharacterSheetStore((store) => store.notes);
  const temporarilyReorderNotes = useCharacterSheetStore(
    (store) => store.temporarilyReorderNotes
  );

  const {
    noteContent,
    noteId: openNoteId,
    setNoteId,
  } = useListenToCharacterSheetNoteContent();
  const { addCharacterNote } = useCharacterSheetAddCharacterNote();
  const { updateCharacterNote } = useCharacterSheetUpdateCharacterNote();
  const { updateCharacterNoteOrder } =
    useCharacterSheetUpdateCharacterNoteOrder();
  const { removeCharacterNote } = useCharacterSheetRemoveCharacterNote();

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
    return updateCharacterNoteOrder({ noteId, order });
  };

  return (
    <Box height={"100%"}>
      <Notes
        notes={notes}
        selectedNoteId={openNoteId}
        selectedNoteContent={noteContent}
        openNote={(noteId) => setNoteId(noteId)}
        createNote={addCharacterNote}
        updateNoteOrder={handleNoteReorder}
        onSave={updateCharacterNote}
        condensedView={isMobile}
        onDelete={(noteId) =>
          removeCharacterNote({ noteId })
            .then(() => {
              setNoteId(undefined);
            })
            .catch()
        }
      />
    </Box>
  );
}
