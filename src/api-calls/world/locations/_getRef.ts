import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  Timestamp,
} from "firebase/firestore";
import {
  GMLocationDocument,
  LocationDocument,
  LocationNotesDocument,
  StoredLocation,
} from "types/Locations.type";

export function constructLocationsPath(worldId: string) {
  return `/worlds/${worldId}/locations`;
}

export function constructLocationDocPath(worldId: string, locationId: string) {
  return `/worlds/${worldId}/locations/${locationId}`;
}

export function constructPrivateDetailsLocationDocPath(
  worldId: string,
  locationId: string
) {
  return constructLocationDocPath(worldId, locationId) + `/private/details`;
}

export function constructPublicNotesLocationDocPath(
  worldId: string,
  locationId: string
) {
  return constructLocationDocPath(worldId, locationId) + `/public/notes`;
}

export function constructLocationImagesPath(
  worldId: string,
  locationId: string
) {
  return `/worlds/${worldId}/locations/${locationId}`;
}

export function constructLocationImagePath(
  worldId: string,
  locationId: string,
  filename: string
) {
  return `/worlds/${worldId}/locations/${locationId}/${filename}`;
}

export function getLocationCollection(worldId: string) {
  return collection(
    firestore,
    constructLocationsPath(worldId)
  ) as CollectionReference<StoredLocation>;
}

export function getLocationDoc(worldId: string, locationId: string) {
  return doc(
    firestore,
    constructLocationDocPath(worldId, locationId)
  ) as DocumentReference<StoredLocation>;
}

export function getPrivateDetailsLocationDoc(
  worldId: string,
  locationId: string
) {
  return doc(
    firestore,
    constructPrivateDetailsLocationDocPath(worldId, locationId)
  ) as DocumentReference<GMLocationDocument>;
}

export function getPublicNotesLocationDoc(worldId: string, locationId: string) {
  return doc(
    firestore,
    constructPublicNotesLocationDocPath(worldId, locationId)
  ) as DocumentReference<LocationNotesDocument>;
}

export function convertToDatabase(
  location: Partial<LocationDocument>
): Partial<StoredLocation> {
  const { updatedDate, createdDate, ...restLocation } = location;
  const newLocation: Partial<StoredLocation> = {
    updatedTimestamp: Timestamp.now(),
    ...restLocation,
  };

  if (createdDate) {
    newLocation.createdTimestamp = Timestamp.fromDate(createdDate);
  }

  return newLocation;
}

export function convertFromDatabase(
  location: StoredLocation
): LocationDocument {
  const { updatedTimestamp, createdTimestamp, ...restLocation } = location;
  return {
    updatedDate: updatedTimestamp.toDate(),
    createdDate: createdTimestamp.toDate(),
    ...restLocation,
  };
}
