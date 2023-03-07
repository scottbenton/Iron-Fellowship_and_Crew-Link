import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { Settings } from "types/Settings.type";

export function constructCampaignCustomMovesDocPath(campaignId: string) {
  return `/campaigns/${campaignId}/settings/settings`;
}

export function constructCampaignSettingsCollectionPath(campaignId: string) {
  return `/campaigns/${campaignId}/settings/`;
}

export function getCampaignCustomMovesDoc(campaignId: string) {
  return doc(
    firestore,
    constructCampaignCustomMovesDocPath(campaignId)
  ) as DocumentReference<Settings>;
}

export function getCampaignSettingsCollection(campaignId: string) {
  return collection(
    firestore,
    constructCampaignSettingsCollectionPath(campaignId)
  ) as CollectionReference<Settings>;
}
