import { createApiFunction } from "api-calls/createApiFunction";
import { updateDoc } from "firebase/firestore";
import { Roll } from "types/DieRolls.type";
import {
  getCampaignGameLogDocument,
  getCharacterGameLogDocument,
} from "./_getRef";

export const updateLog = createApiFunction<
  { campaignId?: string; characterId?: string; logId: string; log: Roll },
  void
>((params) => {
  const { campaignId, characterId, logId, log } = params;

  return new Promise((resolve, reject) => {
    if (!characterId && !campaignId) {
      reject(new Error("Either campaign or character ID must be defined."));
    }

    const docRef = campaignId
      ? getCampaignGameLogDocument(campaignId, logId)
      : getCharacterGameLogDocument(characterId as string, logId);

    // @ts-expect-error not sure why log is incorrect here
    updateDoc(docRef, log)
      .then(() => {
        resolve();
      })
      .catch(reject);
  });
}, "Failed to update roll.");
