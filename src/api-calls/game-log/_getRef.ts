import { firestore } from "config/firebase.config";
import {
  CollectionReference,
  DocumentReference,
  Timestamp,
  WithFieldValue,
  collection,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { Roll } from "types/DieRolls.type";
import { GameLogDocument } from "./_game-log.type";

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
  ) as CollectionReference<GameLogDocument>;
}

export function getCampaignGameLogDocument(campaignId: string, logId: string) {
  return doc(
    firestore,
    constructCampaignGameLogDocPath(campaignId, logId)
  ) as DocumentReference<GameLogDocument>;
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
  ) as CollectionReference<GameLogDocument>;
}

export function getCharacterGameLogDocument(
  characterId: string,
  logId: string
) {
  return doc(
    firestore,
    constructCharacterGameLogDocPath(characterId, logId)
  ) as DocumentReference<GameLogDocument>;
}

export function convertFromDatabase(log: GameLogDocument): Roll {
  return {
    ...log,
    timestamp: log.timestamp?.toDate() ?? new Date(),
  } as Roll;
}

export function convertRollToGameLogDocument(roll: Roll): WithFieldValue<GameLogDocument> {
  return {
    ...roll,
    timestamp: serverTimestamp(),
  };
}
