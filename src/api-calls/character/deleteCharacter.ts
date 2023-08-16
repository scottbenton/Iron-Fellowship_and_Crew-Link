import { useApiState } from "hooks/useApiState";
import { createApiFunction } from "api-calls/createApiFunction";
import { removeCharacterFromCampaign } from "api-calls/campaign/removeCharacterFromCampaign";
import { firebaseAuth, firestore } from "config/firebase.config";
import { deleteDoc, getDoc, getDocs, runTransaction } from "firebase/firestore";
import {
  getCharacterAssetCollection,
  getCharacterAssetDoc,
} from "./assets/_getRef";
import { deleteNotes } from "api-calls/notes/deleteNotes";
import { getCharacterSettingsDoc } from "api-calls/custom-move-oracle-settings/_getRef";
import { getCharacterTracksDoc } from "api-calls/tracks/_getRef";
import { getCharacterDoc } from "./_getRef";

export const deleteCharacter = createApiFunction<
  { characterId: string; campaignId?: string },
  void
>((params) => {
  return new Promise(async (resolve, reject) => {
    const { characterId, campaignId } = params;

    try {
      if (campaignId) {
        await removeCharacterFromCampaign({
          uid: firebaseAuth.currentUser?.uid ?? "",
          campaignId,
          characterId,
        });
      }
      const assetDocs = await getDocs(getCharacterAssetCollection(characterId));
      const promises: Promise<any>[] = [];

      promises.push(deleteNotes({ characterId }));
      promises.push(deleteDoc(getCharacterSettingsDoc(characterId)));
      assetDocs.forEach((asset) => {
        promises.push(deleteDoc(getCharacterAssetDoc(characterId, asset.id)));
      });
      promises.push(deleteDoc(getCharacterTracksDoc(characterId)));

      promises.push(deleteDoc(getCharacterDoc(characterId)));
      await Promise.all(promises);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}, "Failed to delete character.");

export function useDeleteCharacter() {
  const { call, loading, error } = useApiState(deleteCharacter);

  return {
    deleteCharacter: call,
    loading,
    error,
  };
}
