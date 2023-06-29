import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { UserNotLoggedInException } from "api/error/UserNotLoggedInException";
import { updateDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { useAuth } from "providers/AuthProvider";
import { getCampaignNoteDocument } from "./_getRef";
import { NoteNotFoundException } from "api/error/NoteException";

export const updateCampaignNoteOrder: ApiFunction<
  {
    campaignId?: string;
    noteId?: string;
    order: number;
  },
  boolean
> = function (params) {
  const { campaignId, noteId, order } = params;
  return new Promise((resolve, reject) => {
    if (!campaignId) {
      reject(new CampaignNotFoundException());
      return;
    }

    if (!noteId) {
      reject(new NoteNotFoundException());
      return;
    }

    updateDoc(getCampaignNoteDocument(campaignId, noteId), {
      order,
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to reorder note.");
      });
  });
};

export function useUpdateCampaignNoteOrder() {
  const { call, loading, error } = useApiState(updateCampaignNoteOrder);

  return {
    updateCampaignNoteOrder: call,
    loading,
    error,
  };
}
