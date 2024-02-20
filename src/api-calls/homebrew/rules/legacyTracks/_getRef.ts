import {
  CollectionReference,
  DocumentReference,
  collection,
  doc,
} from "firebase/firestore";
import { firestore } from "config/firebase.config";
import { StoredLegacyTrack } from "types/homebrew/HomebrewRules.type";

export function constructHomebrewLegacyTracksCollectionPath() {
  return `homebrew/homebrew/legacy_tracks`;
}

export function constructHomebrewLegacyTrackDocPath(legacyTrackId: string) {
  return `${constructHomebrewLegacyTracksCollectionPath()}/${legacyTrackId}`;
}

export function getHomebrewLegacyTrackCollection() {
  return collection(
    firestore,
    constructHomebrewLegacyTracksCollectionPath()
  ) as CollectionReference<StoredLegacyTrack>;
}

export function getHomebrewLegacyTrackDoc(legacyTrackId: string) {
  return doc(
    firestore,
    constructHomebrewLegacyTrackDocPath(legacyTrackId)
  ) as DocumentReference<StoredLegacyTrack>;
}
