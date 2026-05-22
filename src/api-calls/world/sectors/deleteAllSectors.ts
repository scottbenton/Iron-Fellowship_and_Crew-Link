import { createApiFunction } from "api-calls/createApiFunction";
import { firestore } from "config/firebase.config";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

interface Params {
  worldId: string;
}

function getSectorsCollection(worldId: string) {
  return collection(firestore, `/worlds/${worldId}/sectors`);
}

function getSectorDoc(worldId: string, sectorId: string) {
  return doc(firestore, `/worlds/${worldId}/sectors/${sectorId}`);
}

function getSectorNotesDoc(
  worldId: string,
  sectorId: string,
  visibility: "private" | "public"
) {
  return doc(firestore, `/worlds/${worldId}/sectors/${sectorId}/${visibility}/notes`);
}

function getSectorLocationsCollection(worldId: string, sectorId: string) {
  return collection(firestore, `/worlds/${worldId}/sectors/${sectorId}/locations`);
}

function getSectorLocationDoc(
  worldId: string,
  sectorId: string,
  locationId: string
) {
  return doc(
    firestore,
    `/worlds/${worldId}/sectors/${sectorId}/locations/${locationId}`
  );
}

function getSectorLocationNotesDoc(
  worldId: string,
  sectorId: string,
  locationId: string,
  visibility: "private" | "public"
) {
  return doc(
    firestore,
    `/worlds/${worldId}/sectors/${sectorId}/locations/${locationId}/${visibility}/notes`
  );
}

async function deleteSectorLocations(worldId: string, sectorId: string) {
  const locationSnapshot = await getDocs(
    getSectorLocationsCollection(worldId, sectorId)
  );

  await Promise.all(
    locationSnapshot.docs.flatMap((locationDoc) => [
      deleteDoc(getSectorLocationDoc(worldId, sectorId, locationDoc.id)),
      deleteDoc(
        getSectorLocationNotesDoc(worldId, sectorId, locationDoc.id, "public")
      ),
      deleteDoc(
        getSectorLocationNotesDoc(worldId, sectorId, locationDoc.id, "private")
      ),
    ])
  );
}

export const deleteAllSectors = createApiFunction<Params, void>(
  async ({ worldId }) => {
    const sectorSnapshot = await getDocs(getSectorsCollection(worldId));

    await Promise.all(
      sectorSnapshot.docs.map(async (sectorDoc) => {
        await deleteSectorLocations(worldId, sectorDoc.id);

        await Promise.all([
          deleteDoc(getSectorNotesDoc(worldId, sectorDoc.id, "public")),
          deleteDoc(getSectorNotesDoc(worldId, sectorDoc.id, "private")),
          deleteDoc(getSectorDoc(worldId, sectorDoc.id)),
        ]);
      })
    );
  },
  "Failed to delete sectors."
);
