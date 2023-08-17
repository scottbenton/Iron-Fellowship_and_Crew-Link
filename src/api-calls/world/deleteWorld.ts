import {
  deleteDoc,
  deleteField,
  getDocs,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import { getWorldDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";
import { firestore } from "config/firebase.config";
import {
  getCampaignCollection,
  getCampaignDoc,
} from "api-calls/campaign/_getRef";
import {
  getCharacterCollection,
  getCharacterDoc,
} from "api-calls/character/_getRef";
import { deleteAllLocations } from "./locations/deleteAllLocations";
import { deleteAllLoreDocuments } from "./lore/deleteAllLoreDocuments";
import { deleteAllNPCs } from "./npcs/deleteAllNPCs";

export const deleteWorld = createApiFunction<string, void>((worldId) => {
  return new Promise(async (resolve, reject) => {
    const campaignsUsingWorld = getDocs(
      query(getCampaignCollection(), where("worldId", "==", worldId))
    );
    const charactersUsingWorld = getDocs(
      query(getCharacterCollection(), where("worldId", "==", worldId))
    );

    try {
      const promises: Promise<any>[] = [];
      promises.push(
        runTransaction(firestore, async (transaction) => {
          (await campaignsUsingWorld).docs.map((doc) => {
            transaction.update(getCampaignDoc(doc.id), {
              worldId: deleteField(),
            });
          });
          (await charactersUsingWorld).docs.map((doc) => {
            transaction.update(getCharacterDoc(doc.id), {
              worldId: deleteField(),
            });
          });
        })
      );

      promises.push(deleteAllLocations({ worldId }));
      promises.push(deleteAllLoreDocuments({ worldId }));
      promises.push(deleteAllNPCs({ worldId }));

      await Promise.all(promises);
      await deleteDoc(getWorldDoc(worldId));

      resolve();
    } catch (e) {
      reject(e);
    }
  });
}, "Failed to delete world.");
