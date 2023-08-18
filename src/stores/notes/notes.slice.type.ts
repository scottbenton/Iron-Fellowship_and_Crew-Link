import { Unsubscribe } from "firebase/firestore";
import { Note } from "types/Notes.type";

export const ROLL_LOG_ID = "roll-log";

export interface NotesSliceData {
  notes: Note[];
  loading: boolean;
  error?: string;

  openNoteId?: string;
  openNoteContent?: string;
}

export interface NotesSliceActions {
  subscribe: (
    campaignId: string | undefined,
    characterId: string | undefined
  ) => Unsubscribe;
  subscribeToNoteContent: (noteId: string) => Unsubscribe;

  setOpenNoteId: (openNoteId?: string) => void;

  temporarilyReorderNotes: (noteId: string, order: number) => void;

  addNote: (order: number) => Promise<string>;
  updateNote: (
    noteId: string,
    title: string,
    content: string | undefined,
    isBeaconRequest?: boolean
  ) => Promise<void>;
  updateNoteOrder: (noteId: string, order: number) => Promise<void>;
  removeNote: (noteId: string) => Promise<void>;

  resetStore: () => void;
}

export type NotesSlice = NotesSliceData & NotesSliceActions;
