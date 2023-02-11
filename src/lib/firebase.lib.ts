import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { firestore } from "../config/firebase.config";
import { StoredCampaign } from "../types/Campaign.type";
import { AssetDocument, CharacterDocument } from "../types/Character.type";
import { TracksDocument } from "../types/Track.type";
import { UserDocument } from "../types/User.type";

export function constructCampaignCollectionPath() {
  return `/campaigns`;
}
export function constructCampaignDocPath(campaignId: string) {
  return `/campaigns/${campaignId}`;
}

export function constructUsersCharacterCollectionPath(userId: string) {
  return `/characters/${userId}/characters`;
}

export function constructCharacterDocPath(userId: string, characterId: string) {
  return `/characters/${userId}/characters/${characterId}`;
}

export function constructCharacterAssetDocPath(
  userId: string,
  characterId: string
) {
  return `/characters/${userId}/characters/${characterId}/assets/assets`;
}

export function constructCharacterTrackDocPath(
  userId: string,
  characterId: string
) {
  return `/characters/${userId}/characters/${characterId}/tracks/tracks`;
}

export function constructSharedCampaignTracksDocPath(campaignId: string) {
  return `/campaigns/${campaignId}/tracks/tracks`;
}

export function constructUserDocPath(userId: string) {
  return `/users/${userId}`;
}

export function getCampaignCollection() {
  return collection(
    firestore,
    constructCampaignCollectionPath()
  ) as CollectionReference<StoredCampaign>;
}

export function getCampaignDoc(campaignId: string) {
  return doc(
    firestore,
    constructCampaignDocPath(campaignId)
  ) as DocumentReference<StoredCampaign>;
}

export function getUsersCharacterCollection(userId: string) {
  return collection(
    firestore,
    constructUsersCharacterCollectionPath(userId)
  ) as CollectionReference<CharacterDocument>;
}

export function getCharacterDoc(userId: string, characterId: string) {
  return doc(
    firestore,
    constructCharacterDocPath(userId, characterId)
  ) as DocumentReference<CharacterDocument>;
}

export function getCharacterAssetDoc(userId: string, characterId: string) {
  return doc(
    firestore,
    constructCharacterAssetDocPath(userId, characterId)
  ) as DocumentReference<AssetDocument>;
}

export function getCharacterTracksDoc(userId: string, characterId: string) {
  return doc(
    firestore,
    constructCharacterTrackDocPath(userId, characterId)
  ) as DocumentReference<TracksDocument>;
}

export function getSharedCampaignTracksCollection(campaignId: string) {
  return doc(
    firestore,
    constructSharedCampaignTracksDocPath(campaignId)
  ) as DocumentReference<TracksDocument>;
}

export function getUsersDoc(userId: string) {
  return doc(
    firestore,
    constructUserDocPath(userId)
  ) as DocumentReference<UserDocument>;
}
