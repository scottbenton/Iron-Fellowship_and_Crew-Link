import { firestore } from "config/firebase.config";
import { doc, DocumentReference } from "firebase/firestore";
import { SettingsDoc } from "types/Settings.type";

export function constructCampaignSettingsDocPath(campaignId: string) {
  return `/campaigns/${campaignId}/settings/settings`;
}

export function getCampaignSettingsDoc(campaignId: string) {
  return doc(
    firestore,
    constructCampaignSettingsDocPath(campaignId)
  ) as DocumentReference<SettingsDoc>;
}

export function constructCharacterSettingsDocPath(characterId: string) {
  return `/characters/${characterId}/settings/settings`;
}

export function getCharacterSettingsDoc(characterId: string) {
  return doc(
    firestore,
    constructCharacterSettingsDocPath(characterId)
  ) as DocumentReference<SettingsDoc>;
}
