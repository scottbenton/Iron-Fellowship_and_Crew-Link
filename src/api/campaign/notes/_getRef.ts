import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { NoteContentDocument, NoteDocument } from "types/Notes.type";

export function constructCampaignNoteCollectionPath(campaignId: string) {
  return `/campaigns/${campaignId}/notes`;
}

export function constructCampaignNoteDocPath(
  campaignId: string,
  noteId: string
) {
  return `/campaigns/${campaignId}/notes/${noteId}`;
}

export function constructCampaignNoteContentPath(
  campaignId: string,
  noteId: string
) {
  return `/campaigns/${campaignId}/notes/${noteId}/content/content`;
}

export function getCampaignNoteCollection(campaignId: string) {
  return collection(
    firestore,
    constructCampaignNoteCollectionPath(campaignId)
  ) as CollectionReference<NoteDocument>;
}

export function getCampaignNoteDocument(campaignId: string, noteId: string) {
  return doc(
    firestore,
    constructCampaignNoteDocPath(campaignId, noteId)
  ) as DocumentReference<NoteDocument>;
}

export function getCampaignNoteContentDocument(
  campaignId: string,
  noteId: string
) {
  return doc(
    firestore,
    constructCampaignNoteContentPath(campaignId, noteId)
  ) as DocumentReference<NoteContentDocument>;
}
