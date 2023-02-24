export interface NoteDocument {
  title: string;
  order: number;
}

export interface Note {
  noteId: string;

  title: string;
  order: number;
}

export interface NoteContentDocument {
  content: string;
}
