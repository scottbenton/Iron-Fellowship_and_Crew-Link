import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { NoteContentDocument, NoteDocument } from "types/Notes.type";

export function constructCharacterNoteCollectionPath(
  userId: string,
  characterId: string
) {
  return `/characters/${userId}/characters/${characterId}/notes`;
}

export function constructCharacterNoteDocPath(
  userId: string,
  characterId: string,
  noteId: string
) {
  return `/characters/${userId}/characters/${characterId}/notes/${noteId}`;
}

export function constructCharacterNoteContentPath(
  userId: string,
  characterId: string,
  noteId: string
) {
  return `/characters/${userId}/characters/${characterId}/notes/${noteId}/content/content`;
}

export function getCharacterNoteCollection(
  userId: string,
  characterId: string
) {
  return collection(
    firestore,
    constructCharacterNoteCollectionPath(userId, characterId)
  ) as CollectionReference<NoteDocument>;
}

export function getCharacterNoteDocument(
  userId: string,
  characterId: string,
  noteId: string
) {
  return doc(
    firestore,
    constructCharacterNoteDocPath(userId, characterId, noteId)
  ) as DocumentReference<NoteDocument>;
}

export function getCharacterNoteContentDocument(
  userId: string,
  characterId: string,
  noteId: string
) {
  return doc(
    firestore,
    constructCharacterNoteContentPath(userId, characterId, noteId)
  ) as DocumentReference<NoteContentDocument>;
}
