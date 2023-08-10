import { firestore } from "config/firebase.config";
import { doc, DocumentReference } from "firebase/firestore";
import { TracksDocument } from "types/Track.type";

export function constructCampaignTracksDocPath(campaignId: string) {
  return `/campaigns/${campaignId}/tracks/tracks`;
}

export function getCampaignTracksDoc(campaignId: string) {
  return doc(
    firestore,
    constructCampaignTracksDocPath(campaignId)
  ) as DocumentReference<TracksDocument>;
}

export function constructCharacterTracksDocPath(characterId: string) {
  return `/characters/${characterId}/tracks/tracks`;
}

export function getCharacterTracksDoc(characterId: string) {
  return doc(
    firestore,
    constructCampaignTracksDocPath(characterId)
  ) as DocumentReference<TracksDocument>;
}
