import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { MoveDocument } from "types/Moves.type";

export function constructCampaignCustomMovesDocPath(campaignId: string) {
  return `/campaigns/${campaignId}/settings/moves`;
}

export function getCampaignCustomMovesDoc(campaignId: string) {
  return doc(
    firestore,
    constructCampaignCustomMovesDocPath(campaignId)
  ) as DocumentReference<MoveDocument>;
}
