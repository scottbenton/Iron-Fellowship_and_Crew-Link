import { getDocs, getDoc, query, where } from "firebase/firestore";
import {
  getCampaignNoteCollection,
  getCampaignNoteContentDocument,
  getCharacterNoteCollection,
  getCharacterNoteContentDocument,
} from "./_getRef";
import { NoteDocument } from "./_notes.type";

export interface NoteWithContent {
  noteId: string;
  meta: NoteDocument;
  content: Uint8Array | null;
}

export async function getAllNotesWithContent(params: {
  source: "campaign" | "character";
  ownerId: string;
  onlyShared?: boolean;
}): Promise<NoteWithContent[]> {
  const { source, ownerId, onlyShared } = params;

  const collection =
    source === "campaign"
      ? getCampaignNoteCollection(ownerId)
      : getCharacterNoteCollection(ownerId);

  const notesQuery =
    onlyShared
      ? query(collection, where("shared", "==", true))
      : collection;

  const snapshot = await getDocs(notesQuery);

  const results = await Promise.all(
    snapshot.docs.map(async (noteDoc): Promise<NoteWithContent> => {
      const noteId = noteDoc.id;
      const meta = noteDoc.data();

      const contentRef =
        source === "campaign"
          ? getCampaignNoteContentDocument(ownerId, noteId)
          : getCharacterNoteContentDocument(ownerId, noteId);

      const contentSnap = await getDoc(contentRef);
      const contentData = contentSnap.data();

      const content = contentData?.notes
        ? contentData.notes.toUint8Array()
        : null;

      return { noteId, meta, content };
    })
  );

  return results;
}
