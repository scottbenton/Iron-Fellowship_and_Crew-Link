import { arrayRemove, arrayUnion, setDoc } from "firebase/firestore";
import { getCampaignSettingsDoc, getCharacterSettingsDoc } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const showOrHideCustomMove = createApiFunction<
  {
    campaignId?: string;
    characterId?: string;
    moveId: string;
    hidden: boolean;
  },
  void
>((params) => {
  const { campaignId, characterId, moveId, hidden } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId && !characterId) {
      reject(new Error("Either campaign or character ID must be defined."));
      return;
    }

    setDoc(
      campaignId
        ? getCampaignSettingsDoc(campaignId)
        : getCharacterSettingsDoc(characterId as string),
      {
        hiddenCustomMoveIds: hidden ? arrayUnion(moveId) : arrayRemove(moveId),
      },
      { merge: true }
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to update custom move visibility.");
