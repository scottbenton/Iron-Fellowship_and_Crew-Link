import { getDocs, getDoc, query, where } from "firebase/firestore";
import {
  LocationDocument,
  LocationNotesDocument,
  GMLocationDocument,
} from "./_locations.type";
import {
  getLocationCollection,
  getPublicNotesLocationDoc,
  getPrivateDetailsLocationDoc,
} from "./_getRef";

export interface LocationExportRecord {
  id: string;
  doc: LocationDocument;
  notes: Uint8Array | null;
  gmNotes: Uint8Array | null;
  gmProperties: Omit<GMLocationDocument, "gmNotes"> | null;
}

/**
 * One-shot bulk read of all location documents (and their sub-documents) for
 * export.
 *
 * - isOwner=true  → reads all locations plus public notes, GM notes, and GM
 *                   properties.
 * - isOwner=false → reads only locations where sharedWithPlayers===true, and
 *                   only public notes. GM docs are never fetched.
 */
export async function getAllLocationsForExport(
  worldId: string,
  isOwner: boolean
): Promise<LocationExportRecord[]> {
  const collectionRef = getLocationCollection(worldId);
  const q = isOwner
    ? collectionRef
    : query(collectionRef, where("sharedWithPlayers", "==", true));

  const snapshot = await getDocs(q);
  if (snapshot.empty) return [];

  const records = await Promise.all(
    snapshot.docs.map(async (docSnap): Promise<LocationExportRecord> => {
      const id = docSnap.id;
      const locationDoc = docSnap.data();

      const notesPromise = getDoc(
        getPublicNotesLocationDoc(worldId, id)
      ).catch(() => null);
      const gmPromise = isOwner
        ? getDoc(getPrivateDetailsLocationDoc(worldId, id)).catch(() => null)
        : Promise.resolve(null);

      const [notesSnap, gmSnap] = await Promise.all([notesPromise, gmPromise]);
      const notesDoc: LocationNotesDocument | undefined = notesSnap?.data();
      const notes = notesDoc?.notes?.toUint8Array() ?? null;

      if (!isOwner) {
        return {
          id,
          doc: locationDoc,
          notes,
          gmNotes: null,
          gmProperties: null,
        };
      }

      const gmDoc: GMLocationDocument | undefined = gmSnap?.data();
      const gmNotes = gmDoc?.gmNotes?.toUint8Array() ?? null;
      const gmProperties: Omit<GMLocationDocument, "gmNotes"> | null =
        gmDoc != null
          ? {
              fields: gmDoc.fields,
              descriptor: gmDoc.descriptor,
              trouble: gmDoc.trouble,
              locationFeatures: gmDoc.locationFeatures,
            }
          : null;

      return { id, doc: locationDoc, notes, gmNotes, gmProperties };
    })
  );

  return records;
}
