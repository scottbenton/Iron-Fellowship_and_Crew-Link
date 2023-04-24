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

export function constructLocationsPath(uid: string, worldId: string) {
  return `/users/${uid}/worlds/${worldId}/locations`;
}

export function constructLocationDocPath(
  uid: string,
  worldId: string,
  locationId: string
) {
  return `/users/${uid}/worlds/${worldId}/locations/${locationId}`;
}

export function constructPrivateDetailsLocationDocPath(
  uid: string,
  worldId: string,
  locationId: string
) {
  return (
    constructLocationDocPath(uid, worldId, locationId) + `/private/details`
  );
}

export function constructPublicNotesLocationDocPath(
  uid: string,
  worldId: string,
  locationId: string
) {
  return constructLocationDocPath(uid, worldId, locationId) + `/public/notes`;
}

export function getLocationCollection(uid: string, worldId: string) {
  return collection(
    firestore,
    constructLocationsPath(uid, worldId)
  ) as CollectionReference<StoredLocation>;
}

export function getLocationDoc(
  uid: string,
  worldId: string,
  locationId: string
) {
  return doc(
    firestore,
    constructLocationDocPath(uid, worldId, locationId)
  ) as DocumentReference<StoredLocation>;
}

export function getPrivateDetailsLocationDoc(
  uid: string,
  worldId: string,
  locationId: string
) {
  return doc(
    firestore,
    constructPrivateDetailsLocationDocPath(uid, worldId, locationId)
  ) as DocumentReference<GMLocationDocument>;
}

export function getPublicNotesLocationDoc(
  uid: string,
  worldId: string,
  locationId: string
) {
  return doc(
    firestore,
    constructPublicNotesLocationDocPath(uid, worldId, locationId)
  ) as DocumentReference<LocationNotesDocument>;
}

export function convertToDatabase(
  location: Partial<LocationDocument>
): Partial<StoredLocation> {
  const { updatedDate, ...restLocation } = location;
  return {
    updatedTimestamp: Timestamp.now(),
    ...restLocation,
  };
}
export function convertFromDatabase(
  location: StoredLocation
): LocationDocument {
  const { updatedTimestamp, ...restLocation } = location;
  return {
    updatedDate: updatedTimestamp.toDate(),
    ...restLocation,
  };
}
