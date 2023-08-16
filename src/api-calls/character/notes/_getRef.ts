import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { NoteContentDocument, NoteDocument } from "types/Notes.type";

export function constructCharacterNoteCollectionPath(characterId: string) {
  return `/characters/${characterId}/notes`;
}

export function constructCharacterNoteDocPath(
  characterId: string,
  noteId: string
) {
  return `/characters/${characterId}/notes/${noteId}`;
}

export function constructCharacterNoteContentPath(
  characterId: string,
  noteId: string
) {
  return `/characters/${characterId}/notes/${noteId}/content/content`;
}

export function getCharacterNoteCollection(characterId: string) {
  return collection(
    firestore,
    constructCharacterNoteCollectionPath(characterId)
  ) as CollectionReference<NoteDocument>;
}

export function getCharacterNoteDocument(characterId: string, noteId: string) {
  return doc(
    firestore,
    constructCharacterNoteDocPath(characterId, noteId)
  ) as DocumentReference<NoteDocument>;
}

export function getCharacterNoteContentDocument(
  characterId: string,
  noteId: string
) {
  return doc(
    firestore,
    constructCharacterNoteContentPath(characterId, noteId)
  ) as DocumentReference<NoteContentDocument>;
}
