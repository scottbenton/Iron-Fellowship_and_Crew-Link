import { firestore } from "config/firebase.config";
import { doc, DocumentReference } from "firebase/firestore";
import { CampaignSettingsDoc } from "types/Settings.type";

export function constructCampaignSettingsDocPath(campaignId: string) {
  return `/campaigns/${campaignId}/settings/settings`;
}

export function getCampaignSettingsDoc(campaignId: string) {
  return doc(
    firestore,
    constructCampaignSettingsDocPath(campaignId)
  ) as DocumentReference<CampaignSettingsDoc>;
}
