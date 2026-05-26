import { getDocs, getDoc, query, where } from "firebase/firestore";
import { LoreDocument, LoreNotesDocument, GMLoreDocument } from "./_lore.type";
import {
  getLoreCollection,
  getPublicNotesLoreDoc,
  getPrivateDetailsLoreDoc,
} from "./_getRef";

export interface LoreExportRecord {
  id: string;
  doc: LoreDocument;
  notes: Uint8Array | null;
  gmNotes: Uint8Array | null;
}

/**
 * One-shot bulk read of all lore documents (and their sub-documents) for export.
 *
 * - isOwner=true  → reads all lore plus public notes and GM notes.
 * - isOwner=false → reads only lore where sharedWithPlayers===true, and only
 *                   public notes. GM docs are never fetched.
 */
export async function getAllLoreForExport(
  worldId: string,
  isOwner: boolean
): Promise<LoreExportRecord[]> {
  const collectionRef = getLoreCollection(worldId);
  const q = isOwner
    ? collectionRef
    : query(collectionRef, where("sharedWithPlayers", "==", true));

  const snapshot = await getDocs(q);
  if (snapshot.empty) return [];

  const records = await Promise.all(
    snapshot.docs.map(async (docSnap): Promise<LoreExportRecord> => {
      const id = docSnap.id;
      const loreDoc = docSnap.data();

      const notesSnap = await getDoc(
        getPublicNotesLoreDoc(worldId, id)
      ).catch(() => null);
      const notesDoc: LoreNotesDocument | undefined = notesSnap?.data();
      const notes = notesDoc?.notes?.toUint8Array() ?? null;

      if (!isOwner) {
        return { id, doc: loreDoc, notes, gmNotes: null };
      }

      const gmSnap = await getDoc(
        getPrivateDetailsLoreDoc(worldId, id)
      ).catch(() => null);
      const gmDoc: GMLoreDocument | undefined = gmSnap?.data();
      const gmNotes = gmDoc?.gmNotes?.toUint8Array() ?? null;

      return { id, doc: loreDoc, notes, gmNotes };
    })
  );

  return records;
}
