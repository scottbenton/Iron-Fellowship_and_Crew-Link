import { CampaignNotFoundException } from "api/error/CampaignNotFoundException";
import { addDoc } from "firebase/firestore";
import { ApiFunction, useApiState } from "hooks/useApiState";
import { getCampaignNoteCollection } from "./_getRef";

export const addCampaignNote: ApiFunction<
  {
    campaignId?: string;
    order: number;
  },
  boolean
> = function (params) {
  const { campaignId, order } = params;

  return new Promise((resolve, reject) => {
    if (!campaignId) {
      reject(new CampaignNotFoundException());
      return;
    }

    addDoc(getCampaignNoteCollection(campaignId), {
      order,
      title: "New Page",
    })
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject("Failed to add note");
      });
  });
};

export function useAddCampaignNote() {
  const { call, loading, error } = useApiState(addCampaignNote);

  return {
    addCampaignNote: call,
    loading,
    error,
  };
}
