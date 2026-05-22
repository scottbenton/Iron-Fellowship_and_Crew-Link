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
import { deleteAllSectors } from "./sectors/deleteAllSectors";

export const deleteWorld = createApiFunction<string, void>((worldId) => {
  return new Promise((resolve, reject) => {
    const campaignsUsingWorld = getDocs(
      query(getCampaignCollection(), where("worldId", "==", worldId))
    );
    const charactersUsingWorld = getDocs(
      query(getCharacterCollection(), where("worldId", "==", worldId))
    );

    const promises: Promise<unknown>[] = [];
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
    promises.push(deleteAllSectors({ worldId }));

    Promise.all(promises)
      .then(() => {
        deleteDoc(getWorldDoc(worldId))
          .then(() => {
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to delete world.");
