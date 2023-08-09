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

export const deleteWorld = createApiFunction<string, void>((worldId) => {
  return new Promise((resolve, reject) => {
    const campaignsUsingWorld = getDocs(
      query(getCampaignCollection(), where("worldId", "==", worldId))
    );
    const charactersUsingWorld = getDocs(
      query(getCharacterCollection(), where("worldId", "==", worldId))
    );

    runTransaction(firestore, async (transaction) => {
      const campaignUpdatePromises = (await campaignsUsingWorld).docs.map(
        (doc) => {
          transaction.update(getCampaignDoc(doc.id), {
            worldId: deleteField(),
          });
        }
      );
      const characterUpdatePromises = (await charactersUsingWorld).docs.map(
        (doc) => {
          transaction.update(getCharacterDoc(doc.id), {
            worldId: deleteField(),
          });
        }
      );
      await Promise.all(campaignUpdatePromises);
      await Promise.all(characterUpdatePromises);
    })
      .then(() => {
        deleteDoc(getWorldDoc(worldId))
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to delete world.");
