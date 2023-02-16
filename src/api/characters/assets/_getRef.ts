import { firestore } from "config/firebase.config";
import { doc, DocumentReference } from "firebase/firestore";
import { AssetDocument } from "types/Character.type";

export function constructCharacterAssetDocPath(
  userId: string,
  characterId: string
) {
  return `/characters/${userId}/characters/${characterId}/assets/assets`;
}

export function getCharacterAssetDoc(userId: string, characterId: string) {
  return doc(
    firestore,
    constructCharacterAssetDocPath(userId, characterId)
  ) as DocumentReference<AssetDocument>;
}
