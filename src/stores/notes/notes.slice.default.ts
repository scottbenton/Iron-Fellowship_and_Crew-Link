import { NotesSliceData } from "./notes.slice.type";

export const defaultNotesSlice: NotesSliceData = {
  notes: [],
  loading: false,
  error: undefined,

  openNoteId: undefined,
  openNoteContent: undefined,
};
