import { deleteDoc, getDocs } from "firebase/firestore";
import {
  getCampaignGameLogCollection,
  getCampaignGameLogDocument,
  getCharacterGameLogCollection,
  getCharacterGameLogDocument,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

function getAllLogs(
  campaignId: string | undefined,
  characterId: string | undefined
): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    if (!characterId && !campaignId) {
      reject(new Error("Either character or campaign ID must be defined."));
      return;
    }
    getDocs(
      characterId
        ? getCharacterGameLogCollection(characterId)
        : getCampaignGameLogCollection(campaignId as string)
    )
      .then((snapshot) => {
        const ids = snapshot.docs.map((doc) => doc.id);
        resolve(ids);
      })
      .catch((e) => {
        reject("Failed to get game logs.");
      });
  });
}

export const deleteAllLogs = createApiFunction<
  { characterId?: string; campaignId?: string },
  void
>(({ campaignId, characterId }) => {
  return new Promise<void>((resolve, reject) => {
    if (!campaignId && !characterId) {
      reject("Either campaign or character ID must be defined.");
      return;
    }
    getAllLogs(campaignId, characterId)
      .then((logIds) => {
        const promises = logIds.map((logId) =>
          deleteDoc(
            characterId
              ? getCharacterGameLogDocument(characterId, logId)
              : getCampaignGameLogDocument(campaignId as string, logId)
          )
        );
        Promise.all(promises)
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
}, "Failed to delete some or all logs.");
