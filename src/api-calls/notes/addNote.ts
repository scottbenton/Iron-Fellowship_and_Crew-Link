import { addDoc } from "firebase/firestore";
import {
  getCampaignNoteCollection,
  getCharacterNoteCollection,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

export const addNote = createApiFunction<
  {
    campaignId?: string;
    characterId?: string;
    order: number;
  },
  string
>((params) => {
  const { campaignId, characterId, order } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId && !characterId) {
      reject(new Error("Either character or campaign ID must be defined"));
      return;
    }

    addDoc(
      characterId
        ? getCharacterNoteCollection(characterId)
        : getCampaignNoteCollection(campaignId as string),
      {
        order,
        title: "New Page",
      }
    )
      .then((doc) => {
        resolve(doc.id);
      })
      .catch((e) => {
        reject(e);
      });
  });
}, "Failed to add note.");
