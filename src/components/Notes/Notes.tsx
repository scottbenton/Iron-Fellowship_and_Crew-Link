import { Box } from "@mui/material";
import { Note } from "types/Notes.type";
import { NoteSidebar } from "./NoteSidebar";

export interface NotesProps {
  notes: Note[];
  selectedNoteId?: string;
  openNote: (noteId: string) => void;
  createNote: () => Promise<boolean>;
  updateNoteOrder: (noteId: string, order: number) => Promise<boolean>;
}

export function Notes(props: NotesProps) {
  const { notes, selectedNoteId, openNote, createNote, updateNoteOrder } =
    props;

  return (
    <Box height={"100%"} display={"flex"}>
      <NoteSidebar
        notes={notes}
        selectedNoteId={selectedNoteId}
        openNote={openNote}
        createNote={createNote}
        updateNoteOrder={updateNoteOrder}
      />
      <Box flexGrow={1} flexShrink={0}>
        Note Content
      </Box>
    </Box>
  );
}
