import { getDocs } from "firebase/firestore";
import { removeCampaignNote } from "./removeCampaignNote";
import { getCampaignNoteCollection } from "./_getRef";

function getAllCampaignNotes(campaignId: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    getDocs(getCampaignNoteCollection(campaignId))
      .then((snapshot) => {
        const ids = snapshot.docs.map((doc) => doc.id);
        resolve(ids);
      })
      .catch((e) => {
        reject("Failed to get character notes");
      });
  });
}

export function deleteCampaignNotes(campaignId: string) {
  return new Promise<boolean>((resolve, reject) => {
    getAllCampaignNotes(campaignId)
      .then((noteIds) => {
        const promises = noteIds.map((noteId) =>
          removeCampaignNote({ campaignId, noteId })
        );
        Promise.all(promises)
          .then(() => {
            resolve(true);
          })
          .catch((e) => {
            console.error(e);
            reject("Failed to delete some or all notes.");
          });
      })
      .catch(() => {
        reject("Failed to get character notes");
      });
  });
}
