import { deleteDoc } from "firebase/firestore";
import {
  getCampaignNoteContentDocument,
  getCampaignNoteDocument,
  getCharacterNoteContentDocument,
  getCharacterNoteDocument,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const removeNote = createApiFunction<
  {
    characterId?: string;
    campaignId?: string;
    noteId: string;
  },
  void
>((params) => {
  const { campaignId, characterId, noteId } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId && !characterId) {
      reject(new Error("Either character or campaign ID must be defined."));
    }
    const deleteNotePromise = deleteDoc(
      characterId
        ? getCharacterNoteDocument(characterId, noteId)
        : getCampaignNoteDocument(campaignId as string, noteId)
    );

    const deleteContentPromise = deleteDoc(
      characterId
        ? getCharacterNoteContentDocument(characterId, noteId)
        : getCampaignNoteContentDocument(campaignId as string, noteId)
    );

    Promise.all([deleteNotePromise, deleteContentPromise])
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to remove note.");
