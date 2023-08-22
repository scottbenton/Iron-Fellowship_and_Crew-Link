import { NotesSliceData, ROLL_LOG_ID } from "./notes.slice.type";

export const defaultNotesSlice: NotesSliceData = {
  notes: [],
  loading: false,
  error: undefined,

  openNoteId: undefined,
  openNoteContent: undefined,
};
