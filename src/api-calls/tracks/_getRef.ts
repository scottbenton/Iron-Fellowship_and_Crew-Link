import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  Timestamp,
} from "firebase/firestore";
import { StoredTrack, Track } from "types/Track.type";

export function constructCampaignTracksCollection(campaignId: string) {
  return `/campaigns/${campaignId}/tracks`;
}
export function constructCampaignTracksDocPath(
  campaignId: string,
  trackId: string
) {
  return `/campaigns/${campaignId}/tracks/${trackId}`;
}

export function getCampaignTracksCollection(campaignId: string) {
  return collection(
    firestore,
    constructCampaignTracksCollection(campaignId)
  ) as CollectionReference<StoredTrack>;
}
export function getCampaignTracksDoc(campaignId: string, trackId: string) {
  return doc(
    firestore,
    constructCampaignTracksDocPath(campaignId, trackId)
  ) as DocumentReference<StoredTrack>;
}

export function constructCharacterTracksCollection(characterId: string) {
  return `/characters/${characterId}/tracks`;
}
export function constructCharacterTracksDocPath(
  characterId: string,
  trackId: string
) {
  return `/characters/${characterId}/tracks/${trackId}`;
}

export function getCharacterTracksCollection(characterId: string) {
  return collection(
    firestore,
    constructCharacterTracksCollection(characterId)
  ) as CollectionReference<StoredTrack>;
}
export function getCharacterTracksDoc(characterId: string, trackId: string) {
  return doc(
    firestore,
    constructCharacterTracksDocPath(characterId, trackId)
  ) as DocumentReference<StoredTrack>;
}

export function convertToDatabase(track: Track): StoredTrack {
  const { createdDate, ...rest } = track;

  return {
    ...rest,
    createdTimestamp: Timestamp.fromDate(createdDate),
  };
}

export function convertFromDatabase(track: StoredTrack): Track {
  const { createdTimestamp, ...rest } = track;

  return {
    ...rest,
    createdDate: createdTimestamp.toDate(),
  };
}
