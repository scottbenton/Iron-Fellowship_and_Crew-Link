import { createApiFunction } from "api-calls/createApiFunction";
import { removeCharacterFromCampaign } from "api-calls/campaign/removeCharacterFromCampaign";
import { firebaseAuth } from "config/firebase.config";
import { deleteDoc, getDocs } from "firebase/firestore";
import {
  getCharacterAssetCollection,
  getCharacterAssetDoc,
} from "../assets/_getRef";
import { deleteNotes } from "api-calls/notes/deleteNotes";
import { getCharacterSettingsDoc } from "api-calls/custom-move-oracle-settings/_getRef";
import { getCharacterDoc } from "./_getRef";
import { deleteAllLogs } from "api-calls/game-log/deleteAllLogs";
import { deleteAllProgressTracks } from "api-calls/tracks/deleteAllProgressTracks";

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
      promises.push(deleteAllLogs({ characterId }));
      promises.push(deleteAllProgressTracks({ characterId }));

      await Promise.all(promises);
      await deleteDoc(getCharacterDoc(characterId));
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}, "Failed to delete character.");
