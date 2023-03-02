import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { deleteDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import {
  getCampaignNoteContentDocument,
  getCampaignNoteDocument,
} from "./_getRef";
import { NoteNotFoundException } from "api/error/NoteException";

export const removeCampaignNote: ApiFunction<
  {
    campaignId?: string;
    noteId?: string;
  },
  boolean
> = function (params) {
  const { campaignId, noteId } = params;
  return new Promise((resolve, reject) => {
    if (!campaignId) {
      reject(new CampaignNotFoundException());
      return;
    }

    if (!noteId) {
      reject(new NoteNotFoundException());
      return;
    }

    const deleteNotePromise = deleteDoc(
      getCampaignNoteDocument(campaignId, noteId)
    );

    const deleteContentPromise = deleteDoc(
      getCampaignNoteContentDocument(campaignId, noteId)
    );

    Promise.all([deleteNotePromise, deleteContentPromise])
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to update note.");
      });
  });
};

export function useRemoveCampaignNote() {
  const { call, loading, error } = useApiState(removeCampaignNote);

  return {
    removeCampaignNote: call,
    loading,
    error,
  };
}
