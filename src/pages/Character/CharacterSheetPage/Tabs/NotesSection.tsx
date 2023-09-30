import { Box, LinearProgress, useMediaQuery, useTheme } from "@mui/material";
import { Notes } from "components/features/charactersAndCampaigns/Notes/Notes";
import { useEffect } from "react";
import { ROLL_LOG_ID } from "stores/notes/notes.slice.type";
import { useStore } from "stores/store";

export function NotesSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const notes = useStore((store) => store.notes.notes);
  const temporarilyReorderNotes = useStore(
    (store) => store.notes.temporarilyReorderNotes
  );

  const characterId = useStore(
    (store) => store.characters.currentCharacter.currentCharacterId ?? ""
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
    if (!openNoteId && !isMobile) {
      setNoteId(ROLL_LOG_ID);
    }
  }, [setNoteId, openNoteId, isMobile]);

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
        source={{
          type: "character",
          characterId,
        }}
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
          updateCharacterNote(
            undefined,
            characterId,
            noteId,
            title,
            content,
            isBeaconRequest
          )
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
