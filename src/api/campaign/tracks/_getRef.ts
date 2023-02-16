import { firestore } from "config/firebase.config";
import { doc, DocumentReference } from "firebase/firestore";
import { TracksDocument } from "types/Track.type";

export function constructSharedCampaignTracksDocPath(campaignId: string) {
  return `/campaigns/${campaignId}/tracks/tracks`;
}

export function getSharedCampaignTracksDoc(campaignId: string) {
  return doc(
    firestore,
    constructSharedCampaignTracksDocPath(campaignId)
  ) as DocumentReference<TracksDocument>;
}
