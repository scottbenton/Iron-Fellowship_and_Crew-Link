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
import {
  constructCharacterPortraitFolderPath,
  getCharacterDoc,
} from "./_getRef";
import { deleteAllLogs } from "api-calls/game-log/deleteAllLogs";
import { deleteAllProgressTracks } from "api-calls/tracks/deleteAllProgressTracks";
import { deleteAllAssets } from "api-calls/assets/deleteAllAssets";
import { removeCharacterPortrait } from "./removeCharacterPortrait";
import { deleteImage } from "lib/storage.lib";

export const deleteCharacter = createApiFunction<
  {
    uid: string;
    characterId: string;
    campaignId?: string;
    portraitFilename?: string;
  },
  void
>((params) => {
  return new Promise(async (resolve, reject) => {
    const { uid, characterId, campaignId, portraitFilename } = params;

    try {
      if (campaignId) {
        await removeCharacterFromCampaign({
          uid: firebaseAuth.currentUser?.uid ?? "",
          campaignId,
          characterId,
        });
      }
      const promises: Promise<any>[] = [];

      if (portraitFilename) {
        promises.push(
          deleteImage(
            constructCharacterPortraitFolderPath(uid, characterId),
            portraitFilename
          )
        );
      }

      promises.push(deleteNotes({ characterId }));
      promises.push(deleteDoc(getCharacterSettingsDoc(characterId)));
      promises.push(deleteAllAssets({ characterId }));
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
