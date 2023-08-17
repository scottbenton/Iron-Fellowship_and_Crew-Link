import { updateDoc } from "firebase/firestore";
import { getCampaignNoteDocument, getCharacterNoteDocument } from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const updateNoteOrder = createApiFunction<
  {
    campaignId?: string;
    characterId?: string;
    noteId: string;
    order: number;
  },
  void
>((params) => {
  const { campaignId, characterId, noteId, order } = params;
  return new Promise((resolve, reject) => {
    if (!characterId && !campaignId) {
      reject("Either campaign or character ID must be defined.");
      return;
    }
    updateDoc(
      characterId
        ? getCharacterNoteDocument(characterId, noteId)
        : getCampaignNoteDocument(campaignId as string, noteId),
      {
        order,
      }
    )
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to reorder note.");
