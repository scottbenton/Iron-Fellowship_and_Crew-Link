import { Box, LinearProgress, selectClasses } from "@mui/material";
import { useCharacterSheetAddCharacterNote } from "api/characters/notes/addCharacterNote";
import { useCharacterSheetUpdateCharacterNoteOrder } from "api/characters/notes/updateCharacterNoteOrder";
import { Notes } from "components/Notes/Notes";
import { useEffect, useState } from "react";
import { useCharacterSheetStore } from "../characterSheet.store";

export function NotesSection() {
  const notes = useCharacterSheetStore((store) => store.notes);
  const temporarilyReorderNotes = useCharacterSheetStore(
    (store) => store.temporarilyReorderNotes
  );

  const [openNoteId, setOpenNoteId] = useState<string>();

  const { addCharacterNote } = useCharacterSheetAddCharacterNote();
  const { updateCharacterNoteOrder } =
    useCharacterSheetUpdateCharacterNoteOrder();

  useEffect(() => {
    if (Array.isArray(notes) && notes.length > 0) {
      setOpenNoteId((prevNoteId) => {
        if (prevNoteId) return prevNoteId;
        return notes[notes.length - 1].noteId;
      });
    } else {
      setOpenNoteId(undefined);
    }
  }, [notes]);

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
        openNote={(noteId) => setOpenNoteId(noteId)}
        createNote={addCharacterNote}
        updateNoteOrder={handleNoteReorder}
      />
    </Box>
  );
}
