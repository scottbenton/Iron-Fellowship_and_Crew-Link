import { firestore } from "config/firebase.config";
import {
  CollectionReference,
  DocumentReference,
  Timestamp,
  collection,
  doc,
} from "firebase/firestore";
import { Roll } from "types/DieRolls.type";

export function constructCampaignGameLogCollectionPath(campaignId: string) {
  return `/campaigns/${campaignId}/game-log`;
}

export function constructCampaignGameLogDocPath(
  campaignId: string,
  logId: string
) {
  return `/campaigns/${campaignId}/game-log/${logId}`;
}

export function getCampaignGameLogCollection(campaignId: string) {
  return collection(
    firestore,
    constructCampaignGameLogCollectionPath(campaignId)
  ) as CollectionReference<Roll>;
}

export function getCampaignNoteDocument(campaignId: string, noteId: string) {
  return doc(
    firestore,
    constructCampaignGameLogDocPath(campaignId, noteId)
  ) as DocumentReference<Roll>;
}

export function constructCharacterGameLogCollectionPath(characterId: string) {
  return `/characters/${characterId}/game-log`;
}

export function constructCharacterGameLogDocPath(
  characterId: string,
  logId: string
) {
  return `/characters/${characterId}/game-log/${logId}`;
}

export function getCharacterGameLogCollection(characterId: string) {
  return collection(
    firestore,
    constructCharacterGameLogCollectionPath(characterId)
  ) as CollectionReference<Roll>;
}

export function getCharacterNoteDocument(characterId: string, noteId: string) {
  return doc(
    firestore,
    constructCampaignGameLogDocPath(characterId, noteId)
  ) as DocumentReference<Roll>;
}

export type DatabaseLog = Omit<Roll, "timestamp"> & {
  timestamp: Timestamp;
};

export function convertFromDatabase(log: DatabaseLog): Roll {
  return {
    ...log,
    timestamp: log.timestamp.toDate(),
  } as Roll;
}
