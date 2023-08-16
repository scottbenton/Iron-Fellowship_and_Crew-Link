import { getDocs } from "firebase/firestore";
import { removeNote } from "./removeNote";
import {
  getCampaignNoteCollection,
  getCharacterNoteCollection,
} from "./_getRef";
import { createApiFunction } from "api-calls/createApiFunction";

function getAllNotes(
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
        ? getCharacterNoteCollection(characterId)
        : getCampaignNoteCollection(campaignId as string)
    )
      .then((snapshot) => {
        const ids = snapshot.docs.map((doc) => doc.id);
        resolve(ids);
      })
      .catch((e) => {
        reject("Failed to get notes.");
      });
  });
}

export const deleteNotes = createApiFunction<
  { characterId?: string; campaignId?: string },
  void
>(({ campaignId, characterId }) => {
  return new Promise<void>((resolve, reject) => {
    if (!campaignId && !characterId) {
      reject("Either campaign or character ID must be defined.");
      return;
    }
    getAllNotes(campaignId, characterId)
      .then((noteIds) => {
        const promises = noteIds.map((noteId) =>
          removeNote({ campaignId, characterId, noteId })
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
}, "Failed to delete some or all notes.");
