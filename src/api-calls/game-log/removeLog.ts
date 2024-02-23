import { createApiFunction } from "api-calls/createApiFunction";
import { deleteDoc } from "firebase/firestore";
import {
  getCampaignGameLogDocument,
  getCharacterGameLogDocument,
} from "./_getRef";

export const removeLog = createApiFunction<
  { campaignId?: string; characterId?: string; logId: string },
  void
>((params) => {
  const { campaignId, characterId, logId } = params;

  return new Promise((resolve, reject) => {
    if (!characterId && !campaignId) {
      reject(new Error("Either campaign or character ID must be defined."));
    }

    const docRef = characterId
      ? getCharacterGameLogDocument(characterId, logId)
      : getCampaignGameLogDocument(campaignId as string, logId);

    deleteDoc(docRef)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to delete roll.");
