import { firestore } from "config/firebase.config";
import { doc, DocumentReference } from "firebase/firestore";

export function constructCampaignCustomMoveDocPath(campaignId: string) {
  return `/campaigns/${campaignId}/settings/moves`;
}

export function getCampaignCustomMoveDoc(campaignId: string) {
  return doc(
    firestore,
    constructCampaignCustomMoveDocPath(campaignId)
  ) as DocumentReference;
}
