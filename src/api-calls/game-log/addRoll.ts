import { createApiFunction } from "api-calls/createApiFunction";
import { addDoc } from "firebase/firestore";
import { Roll } from "types/DieRolls.type";
import {
  getCampaignGameLogCollection,
  getCharacterGameLogCollection,
} from "./_getRef";

export const addRoll = createApiFunction<
  { roll: Roll; campaignId?: string; characterId?: string },
  void
>((params) => {
  const { characterId, campaignId, roll } = params;

  return new Promise((resolve, reject) => {
    if (!characterId && !campaignId) {
      reject(new Error("Either campaign or character ID must be defined."));
    }

    addDoc(
      campaignId
        ? getCampaignGameLogCollection(campaignId)
        : getCharacterGameLogCollection(characterId as string),
      roll
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to add roll to log.");
