import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  Timestamp,
} from "firebase/firestore";
import { StarforgedLocation } from "types/LocationStarforged.type";
import { NoteContentDocument } from "types/Notes.type";
import { Sector, StoredSector } from "types/Sector.type";

export function constructSectorLocationsPath(
  worldId: string,
  sectorId: string
) {
  return `/worlds/${worldId}/sectors/${sectorId}/locations`;
}

export function constructSectorLocationDocPath(
  worldId: string,
  sectorId: string,
  locationId: string
) {
  return `/worlds/${worldId}/sectors/${sectorId}/locations/${locationId}`;
}

export function constructPrivateSectorLocationNotesDocPath(
  worldId: string,
  sectorId: string,
  locationId: string
) {
  return (
    constructSectorLocationDocPath(worldId, sectorId, locationId) +
    `/private/notes`
  );
}

export function constructPublicSectorLocationNotesDocPath(
  worldId: string,
  sectorId: string,
  locationId: string
) {
  return (
    constructSectorLocationDocPath(worldId, sectorId, locationId) +
    `/public/notes`
  );
}

export function getSectorLocationsCollection(
  worldId: string,
  sectorId: string
) {
  return collection(
    firestore,
    constructSectorLocationsPath(worldId, sectorId)
  ) as CollectionReference<StarforgedLocation>;
}

export function getSectorLocationDoc(
  worldId: string,
  sectorId: string,
  locationId: string
) {
  return doc(
    firestore,
    constructSectorLocationDocPath(worldId, sectorId, locationId)
  ) as DocumentReference<StarforgedLocation>;
}

export function getPrivateSectorLocationNotesDoc(
  worldId: string,
  sectorId: string,
  locationId: string
) {
  return doc(
    firestore,
    constructPrivateSectorLocationNotesDocPath(worldId, sectorId, locationId)
  ) as DocumentReference<NoteContentDocument>;
}

export function getPublicSectorLocationNotesDoc(
  worldId: string,
  sectorId: string,
  locationId: string
) {
  return doc(
    firestore,
    constructPublicSectorLocationNotesDocPath(worldId, sectorId, locationId)
  ) as DocumentReference<NoteContentDocument>;
}
