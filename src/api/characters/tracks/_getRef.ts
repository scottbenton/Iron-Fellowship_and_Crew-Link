import { firestore } from "config/firebase.config";
import { doc, DocumentReference } from "firebase/firestore";
import { TracksDocument } from "types/Track.type";

export function constructCharacterTrackDocPath(
  userId: string,
  characterId: string
) {
  return `/characters/${userId}/characters/${characterId}/tracks/tracks`;
}

export function getCharacterTracksDoc(userId: string, characterId: string) {
  return doc(
    firestore,
    constructCharacterTrackDocPath(userId, characterId)
  ) as DocumentReference<TracksDocument>;
}
