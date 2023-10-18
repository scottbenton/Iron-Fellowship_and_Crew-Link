import { firestore } from "config/firebase.config";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
} from "firebase/firestore";
import { StoredAsset } from "types/Asset.type";

export function constructCharacterAssetCollectionPath(characterId: string) {
  return `/characters/${characterId}/assets`;
}

export function constructCharacterAssetDocPath(
  characterId: string,
  assetId: string
) {
  return `${constructCharacterAssetCollectionPath(characterId)}/${assetId}`;
}

export function constructCampaignAssetCollectionPath(campaignId: string) {
  return `/campaigns/${campaignId}/assets`;
}

export function constructCampaignAssetDocPath(
  campaignId: string,
  assetId: string
) {
  return `${constructCampaignAssetCollectionPath(campaignId)}/${assetId}`;
}

export function getCharacterAssetCollection(characterId: string) {
  return collection(
    firestore,
    constructCharacterAssetCollectionPath(characterId)
  ) as CollectionReference<StoredAsset>;
}

export function getCharacterAssetDoc(characterId: string, assetId: string) {
  return doc(
    firestore,
    constructCharacterAssetDocPath(characterId, assetId)
  ) as DocumentReference<StoredAsset>;
}

export function getCampaignAssetCollection(campaignId: string) {
  return collection(
    firestore,
    constructCampaignAssetCollectionPath(campaignId)
  ) as CollectionReference<StoredAsset>;
}

export function getCampaignAssetDoc(campaignId: string, assetId: string) {
  return doc(
    firestore,
    constructCampaignAssetDocPath(campaignId, assetId)
  ) as DocumentReference<StoredAsset>;
}
