import { getDocs, getDoc, query, where } from "firebase/firestore";
import { NPCDocument, NPCNotesDocument, GMNPCDocument } from "./_npcs.type";
import {
  getNPCCollection,
  getPublicNotesNPCDoc,
  getPrivateDetailsNPCDoc,
} from "./_getRef";

export interface NPCExportRecord {
  id: string;
  doc: NPCDocument;
  notes: Uint8Array | null;
  gmNotes: Uint8Array | null;
  gmProperties: Omit<GMNPCDocument, "gmNotes"> | null;
}

/**
 * One-shot bulk read of all NPC documents (and their sub-documents) for export.
 *
 * - isOwner=true  → reads all NPCs plus public notes, GM notes, and GM properties.
 * - isOwner=false → reads only NPCs where sharedWithPlayers===true, and only
 *                   public notes. GM docs are never fetched (mirrors the
 *                   existing listenToNPCs permission gating).
 */
export async function getAllNPCsForExport(
  worldId: string,
  isOwner: boolean
): Promise<NPCExportRecord[]> {
  const collectionRef = getNPCCollection(worldId);
  const q = isOwner
    ? collectionRef
    : query(collectionRef, where("sharedWithPlayers", "==", true));

  const snapshot = await getDocs(q);
  if (snapshot.empty) return [];

  const records = await Promise.all(
    snapshot.docs.map(async (docSnap): Promise<NPCExportRecord> => {
      const id = docSnap.id;
      const npcDoc = docSnap.data();

      const notesSnap = await getDoc(
        getPublicNotesNPCDoc(worldId, id)
      ).catch(() => null);
      const notesDoc: NPCNotesDocument | undefined = notesSnap?.data();
      const notes = notesDoc?.notes?.toUint8Array() ?? null;

      if (!isOwner) {
        return { id, doc: npcDoc, notes, gmNotes: null, gmProperties: null };
      }

      const gmSnap = await getDoc(
        getPrivateDetailsNPCDoc(worldId, id)
      ).catch(() => null);
      const gmDoc: GMNPCDocument | undefined = gmSnap?.data();
      const gmNotes = gmDoc?.gmNotes?.toUint8Array() ?? null;
      const gmProperties: Omit<GMNPCDocument, "gmNotes"> | null =
        gmDoc != null
          ? {
              goal: gmDoc.goal,
              role: gmDoc.role,
              descriptor: gmDoc.descriptor,
              disposition: gmDoc.disposition,
              activity: gmDoc.activity,
              firstLook: gmDoc.firstLook,
              revealedAspect: gmDoc.revealedAspect,
            }
          : null;

      return { id, doc: npcDoc, notes, gmNotes, gmProperties };
    })
  );

  return records;
}
