import { Box } from "@mui/material";
import { useListenToCharacterNoteContent } from "api/characters/notes/listenToCharacterNoteContent";
import { useListenToCharacterNotes } from "api/characters/notes/listenToCharacterNotes";
import { Notes } from "components/Notes/Notes";

export interface CharacterNotesComponentProps {
  uid: string;
  characterId: string;
}

export function CharacterNotesComponent(props: CharacterNotesComponentProps) {
  const { uid, characterId } = props;

  const { notes } = useListenToCharacterNotes(uid, characterId);

  const { noteId, noteContent, setNoteId } = useListenToCharacterNoteContent(
    uid,
    characterId
  );

  return (
    <Box>
      <Notes
        notes={notes}
        selectedNoteId={noteId}
        selectedNoteContent={noteContent}
        openNote={setNoteId}
        condensedView
      />
    </Box>
  );
}
